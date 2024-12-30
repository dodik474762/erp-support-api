/* eslint-disable @typescript-eslint/no-var-requires */

const Core = {
  digitCount: (length: number, value: string): any => {
    while (value.length < length) value = '0' + value;

    return value;
  },

  dateFormat: (date: Date): string => {
    const current_date = date;
    const month =
      current_date.getMonth() + 1 < 10
        ? '0' + (current_date.getMonth() + 1)
        : current_date.getMonth() + 1;
    const day =
      current_date.getDate() < 10
        ? '0' + current_date.getDate()
        : current_date.getDate();
    const format_date = current_date.getFullYear() + '-' + month + '-' + day;

    return format_date;
  },

  getArrayChunks: <T>(array: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  },

  base64_encode: async (file) => {
    try {
      // read binary data
      const fs = require('fs');
      const bitmap = fs.readFileSync(file);
      // convert binary data to base64 encoded string
      return new Buffer(bitmap).toString('base64');
    } catch (error) {
      return null;
    }
  },
  // function to create file from base64 encoded string
  base64_decode: async (base64str, file) => {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    const bitmap = new Buffer(base64str, 'base64');
    const fs = require('fs');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
  },
};

export default Core;
