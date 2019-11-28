import React from "react";
import "./App.css";

import ImageFileItem from "./ImageFileItem";

import firebase from "firebase/app";
// https://github.com/CSFrequency/react-firebase-hooks
import { useCollection } from "react-firebase-hooks/firestore";
import { IonList } from "@ionic/react";

/**
 * 
 */
export default function ImageFileList() {
  // this is from firebase-hooks, it allows us to query all of the itemss
  // from the `things` collection in the database in desc order based on
  // the creation data
  const [value, loading, error] = useCollection(
    firebase
      .firestore()
      .collection("image-file")
      .orderBy("createdOn", "desc"),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );

  const closeSlidingItems = () => {
    var list = document.getElementById("list");
    list.closeSlidingItems();
  };

  /**
   * deletes item from firebase database using the id
   * of teh object
   *
   * @param {*} id
   */
  const doDelete = ({ id, ref }) => {
    // delete the file reference from storage
    // Create a reference to the file to delete
    const storageRef = firebase
      .storage()
      .ref()
      .child(ref);

    return new Promise(async (resolve, reject) => {
      try {
        // Delete the file
        await storageRef.delete();

        // delete the database entry
        let result = await firebase
          .firestore()
          .collection("image-file")
          .doc(id)
          .delete();
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  };

  return (
    <>
      <h4>Image File Collection</h4>
      {error ? <div>error.message</div> : null}
      <IonList id="list">
        {value &&
          value.docs.map(doc => {
            let docData = { ...doc.data(), id: doc.id };
            return (
              !loading && (
                <ImageFileItem
                  data={docData}
                  doDelete={i => {
                    closeSlidingItems();
                    doDelete({ id: docData.id, ref: docData.image.ref });
                  }}
                  key={doc.id}
                />
              )
            );
          })}
      </IonList>
    </>
  );
}
