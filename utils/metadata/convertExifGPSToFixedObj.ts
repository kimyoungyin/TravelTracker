export default (gps: ExifReader.GpsTags | undefined) => {
    const latitude = Number(gps?.Latitude?.toFixed(6)) || null;
    const longtitude = Number(gps?.Longitude?.toFixed(6)) || null;

    return { latitude, longtitude };
};
