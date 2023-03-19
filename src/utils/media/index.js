const getBase64 = async (file) => {
  var reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((reslove, reject) => {
    reader.onload = () => reslove(reader.result);
    reader.onerror = (error) => reject(error);
  })
}
export { getBase64 };