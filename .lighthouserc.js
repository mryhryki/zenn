// AdminToken: fqoydkPvKyZJCy6LlbWSlsZrRhe6lhKZrbGlMzSI
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./",
    },
    upload: {
      target: "lhci",
      serverBaseUrl: "https://lighthouse-hyiromori.herokuapp.com",
      token: "df7210bf-1658-4cd4-9b5b-9d97dc2646aa",
      basicAuth: {
        username: "hyiromori",
        password: "ZGpe6OJoZoTrrCglwGB4EogO"
      },
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 1}],
        "unsized-images": "off",
        "image-size-responsive": "off"
      }
    },
  },
};
