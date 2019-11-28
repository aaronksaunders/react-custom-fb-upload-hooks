import  { useState, useEffect } from "react";
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
  }


  const onSave = async _data => {
    let collectionRef = firebase
      .firestore()
      .collection(DOCUMENT_COLLECTION_NAME);
    return await collectionRef.add({
      ..._data,
      createdOn: firebase.firestore.FieldValue.serverTimestamp()
    });
  };

  useEffect(() => {
    const storageRef = firebase.storage().ref();
    const uploadData = async () => {
      // initialize upload information
      setIsError(false);
      setIsLoading(true);

      setProgress({ value: 0 });

      try {
        let ref = storageRef.child(STORAGE_FILE_PATH + fileData.fileName);
        let uploadTask = ref.putString(fileData.dataUrl, "data_url", {
          contentType: "image/" + fileData.format
        });

        // The first example.
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          _progress => {
            var value = _progress.bytesTransferred / _progress.totalBytes;
            console.log("Upload is " + value * 100 + "% done");
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

  return [{ data, isLoading, isError, progress }, setFileData, clearData ];
}

export default FirebaseFileUploadApi;
