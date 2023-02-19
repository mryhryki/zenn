---
title: HTTP server runs on AWS Lambda
canonical: https://mryhryki.medium.com/2023-02-19-http-server-runs-on-aws-lambda-d4811c6cb300
---

## TL;DR

With aws-lambda-adapter, you can easily run an HTTP server on a container image on AWS Lambda.

```diff
# Dockerfile
  ...
+ COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.6.1 /lambda-adapter /opt/extensions/lambda-adapter
  ...
```

## Introduction

I read a Japanese article about how to convert a web app to serverless.

https://aws.amazon.com/jp/builders-flash/202301/lambda-web-adapter/

I‘m interested in Rust, I tried to run an HTTP server using Rust web framework on AWS Lambda.

### Example repository

https://github.com/mryhryki/example-rust-server-on-lambda

## HTTP server example (Rust — axum)

I implemented a HTTP Server by Rust and axum. This code is mostly sample code from axum repository.

```rust
use axum::{
    routing::{get, post},
    http::StatusCode,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    // initialize tracing
    tracing_subscriber::fmt::init();
    // build our application with a route
    let app = Router::new()
        // `GET /` goes to `root`
        .route("/", get(root))
        // `POST /users` goes to `create_user`
        .route("/users", post(create_user));
    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Hello, World!"
}

async fn create_user(
    // this argument tells axum to parse the request body
    // as JSON into a `CreateUser` type
    Json(payload): Json<CreateUser>,
) -> (StatusCode, Json<User>) {
    // insert your application logic here
    let user = User {
        id: 1337,
        username: payload.username,
    };
    // this will be converted into a JSON response
    // with a status code of `201 Created`
    (StatusCode::CREATED, Json(user))
}

// the input to our `create_user` handler
#[derive(Deserialize)]
struct CreateUser {
    username: String,
}

// the output to our `create_user` handler
#[derive(Serialize)]
struct User {
    id: u64,
    username: String,
}
```

## Build container image

### Prepare a Dockerfile

This Dockerfile is normal for a web application.

```dockerfile
# Dockerfile
FROM rust:1-slim-buster as builder
WORKDIR /app
COPY ./Cargo.toml /app/Cargo.toml
COPY ./Cargo.lock /app/Cargo.lock
COPY ./src /app/src

RUN cargo build --release
FROM debian:buster-slim
WORKDIR /app
COPY --from=builder "/app/target/release/example-rust-server-on-lambda" "/app/example-rust-server-on-lambda"
EXPOSE 8080
ENTRYPOINT ["/app/example-rust-server-on-lambda"]
```

### Add to copy “aws-lambda-adapter” step

Add a step to the Dockerfile to copy aws-lambda-adapter. Just added this step, and the container image will be able to run on AWS Lambda.

```diff
  ...
  FROM debian:buster-slim
+ COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.6.1 /lambda-adapter /opt/extensions/lambda-adapter
  WORKDIR /app
  COPY --from=builder "/app/target/release/example-rust-server-on-lambda" "/app/example-rust-server-on-lambda"
  EXPOSE 8080
  ...
```

Note: aws-lambda-adapter default port is “8080”. If your web application uses other port, you have to set environment variables.

### Build

Execute the following command to build the container image.

```shell
# Login to Amazon ECR Public
$ aws ecr-public get-login-password --region us-east-1 |
    docker login --username AWS --password-stdin public.ecr.aws

# Build container image
$ export DOCKER_TAG="IMAGE_NAME:latest"
$ docker build --tag "${DOCKER_TAG}" .
```

### Push to Amazon ECR

Execute the following command to push to the your ECR repository.

```shell
$ export DOCKER_TAG="IMAGE_NAME:latest"
$ export ECR_URI="${YOUR_AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/IMAGE_NAME:latest"

$ aws ecr get-login-password --region ap-northeast-1 |
    docker login --username AWS --password-stdin "${ECR_URI}"
$ docker tag "${DOCKER_TAG}" "${ECR_URI}"
$ docker push "${ECR_URI}"
```

## Deploy to AWS Lambda with Pulumi

I deployed an axum HTTP server on AWS using Pulumi. The reason I used Pulumi is because I heard it is the modern IaC tool. However, you can deploy it any way you like, such as AWS console, Terraform, etc.

I wrote the following TypeScript code, but I’m a Pulumi beginner, so this code may not be the best way.

```typescript
import * as aws from "@pulumi/aws";

const lambdaRole = new aws.iam.Role("example-rust-server-on-lambda-role", {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [{
      Action: "sts:AssumeRole",
      Principal: {
        Service: "lambda.amazonaws.com",
      },
      Effect: "Allow",
      Sid: "",
    }],
  },
});

new aws.iam.RolePolicyAttachment(
  "example-rust-server-on-lambda-policy-attachment",
  {
    role: lambdaRole,
    policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
  },
);

const lambdaFunction = new aws.lambda.Function(
  "example-rust-server-on-lambda",
  {
    packageType: "Image",
    imageUri: process.env.ECR_URI,
    role: lambdaRole.arn,
  },
);

new aws.lambda.FunctionUrl("example-rust-server-on-lambda", {
  functionName: lambdaFunction.name,
  authorizationType: "NONE",
}).functionUrl.apply(console.log);
```

### Using Lambda function URLs

In this example, I use the Lambda function URLs. It provides an HTTP endpoint without using other services such as API Gateway.

## Result

Accessing HTTP endpoints via cURL and returns 200 Success.

```shell
# GET /
$ curl https://2svshuw3qrunpbd7zcl4uhd44a0mpifl.lambda-url.ap-northeast-1.on.aws/
Hello, World!

# POST /users
$ curl -XPOST \
    -H 'Content-Type: application/json' \
    -d '{"username":"mryhryki"}' \
    https://2svshuw3qrunpbd7zcl4uhd44a0mpifl.lambda-url.ap-northeast-1.on.aws/users
{"id":1337,"username":"mryhryki"}
```
