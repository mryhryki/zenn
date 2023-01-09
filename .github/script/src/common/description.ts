const matcher = new RegExp("^([^#>-]+)");

export const extractDescription = (id: string, markdown: string): string => {
  const description = markdown.split("\n").find((line) => {
    return matcher.test(line.trim()) && !line.startsWith("http");
  });
  if (description != null) {
    return description.trim();
  }
  throw new Error(`Extract description failed with '${id}'`);
};
