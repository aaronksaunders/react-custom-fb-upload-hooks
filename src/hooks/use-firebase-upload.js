import { useState, useEffect } from "react";
import firebase from "firebase";

const DOCUMENT_COLLECTION_NAME = "image-file";
const STORAGE_FILE_PATH = "images/";

function FirebaseFileUploadApi() {
  const [data, setData] = useState();
  const [fileData, setFileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(null);

  const clearData = () => {
    setData(null);
  };

  /**
   *
   */
  const generateFromImage = (
    img,
    MAX_WIDTH = 300,
    MAX_HEIGHT = 300,
    quality = 1
  ) => {
    return new Promise((resolve, reject) => {
      var canvas = document.createElement("canvas");
      var image = new Image();

      image.onerror = error => {
        reject(error);
      };

      image.onload = () => {
        var width = image.width;
        var height = image.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0, width, height);

        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL("image/jpeg", quality);

        resolve(dataUrl);
      };
      image.src = img;
    });
  };

  useEffect(() => {
    const storageRef = firebase.storage().ref();
    const uploadData = async () => {
      // initialize upload information
      setIsError(false);
      setIsLoading(true);

      setProgress({ value: 0 });
      // ensure unique file names
      let uniquePathName =
        new Date().getTime() +
        "-" +
        firebase.auth().currentUser.uid +
        "-" +
        fileData.fileName;

      try {
        let ref = storageRef.child(STORAGE_FILE_PATH + uniquePathName);
        let uploadTask = ref.putString(fileData.dataUrl, "data_url", {
          contentType: "image/" + fileData.format,
        });

        
        // The first example.
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          _progress => {
            var value = _progress.bytesTransferred / _progress.totalBytes;
            setProgress({ value });
          },
          _error => {
            setIsLoading(false);
            setIsError(_error);
          },
          async _complete => {
            setIsError(false);
            setIsLoading(false);

            let downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
            let storageData = {
              //   metaData: uploadTask.snapshot.metadata,
              downloadUrl,
              name: uploadTask.snapshot.metadata.name,
              image: {
                ref: uploadTask.snapshot.ref.fullPath,
                size: uploadTask.snapshot.metadata.size,
                contentType: uploadTask.snapshot.metadata.contentType,
                timeCreated: uploadTask.snapshot.metadata.timeCreated
              }
            };

            // save to collection
            let docSaved = await onSave(storageData);

            // get document
            let docData = await docSaved.get();
            setData({
              ...docData.data(),
              id: docData.id
            });

            setProgress(null);
          }
        );
      } catch (_error) {
        setIsLoading(false);
        setIsError(_error);
      }
    };

    fileData && uploadData();
  }, [fileData]);

  /**
   *
   * @param {*} _data
   */
  const onSave = async _data => {
    let thumb = await generateFromImage(fileData.dataUrl);
    let collectionRef = firebase
      .firestore()
      .collection(DOCUMENT_COLLECTION_NAME);
    return await collectionRef.add({
      ..._data,
      thumb,
      createdOn: firebase.firestore.FieldValue.serverTimestamp()
    });
  };

  return [{ data, isLoading, isError, progress }, setFileData, clearData];
}

export default FirebaseFileUploadApi;
