export default (exifDateTime: ExifReader.StringArrayTag | undefined) =>
    exifDateTime
        ? new Date(
              exifDateTime.description
                  .split(" ")
                  .map((el, index) =>
                      index === 1 ? el : el.replaceAll(":", "-")
                  )
                  .join("T")
          )
        : null;
