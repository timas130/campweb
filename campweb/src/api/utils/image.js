import imageBlobReduce from "image-blob-reduce";

export async function resizeImage(img, maxSide, maxSize) {
  const reducer = imageBlobReduce();
  let q = 1.0;
  reducer._create_blob = function (env) {
    return this.pica.toBlob(env.out_canvas, 'image/jpeg', q)
      .then(function (blob) {
        env.out_blob = blob;
        return env;
      });
  };
  while (true) {
    const result = await reducer.toBlob(img, {max: maxSide});
    console.log("[resizeImage] tried quality", q, "resulting size:", result.size);
    if (result.size <= maxSize) return result;
    q -= 0.1;
    if (q === 0.0) return null;
  }
}
