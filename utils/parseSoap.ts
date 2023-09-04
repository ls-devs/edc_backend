import { parseString } from "xml2js";

export const parseSoapXML: <T>(data: string) => Promise<T> = <T>(
  data: string,
): Promise<T> => {
  return new Promise((resolve) => {
    parseString(data, (__err, result) => {
      return resolve(result);
    });
  });
};
