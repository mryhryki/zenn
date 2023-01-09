const LinkPattern = new RegExp("\\[(.+?)]\\(.+\\)", "gi");
const CodePattern = new RegExp("`(.+?)`", "gi");

export const extractDescription = (id: string, markdown: string): string => {
  const description = markdown
    .split(/\n/g)
    .map((line) => line.trim())
    .find(
      (line) =>
        line !== "" &&
        !line.startsWith("-") && //
        !line.startsWith("#") && //
        !line.startsWith("-") && //
        !line.startsWith(">") && //
        !line.startsWith("<!--") && //
        !line.startsWith("![") && //
        !line.startsWith("https://") && //
        !line.startsWith("※この記事")
    );

  if (description != null) {
    return description.replace(LinkPattern, "$1").replace(CodePattern, "$1");
  }
  throw new Error(`Extract description failed with '${id}'`);
};
