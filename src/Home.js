import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonProgressBar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonButtons
} from "@ionic/react";
import "./App.css";

// import the components we are rendering on page
import ImageFileList from "./ImageFileList";
import firebase from "firebase";
import AddImage from "./components/AddImage";

import useFirebaseUpload from "./hooks/use-firebase-upload";

function Home() {
  const [currentImage, setCurrentImage] = useState(null);

  const [
    { data, isLoading, isError, progress },
    setFileData, clearData
  ] = useFirebaseUpload({ i: {} });

  /**
   * logout of firebase
   */
  const doLogout = () => {
    firebase.auth().signOut();
  };

  const onSaveImage = () => {
    setFileData(currentImage);
  };


  if (data) {
    alert("File Uploaded Successfully");
    clearData();
  }

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Home</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => doLogout()}>LOGOUT</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* for for editing or creating */}
        {isError && <div>ERROR: {isError.message}</div>}
        {/* {data && <div>{JSON.stringify(data)}</div>} */}
        {isLoading ? (
          <div style={{padding : 10}}>
          <IonProgressBar value={progress.value}></IonProgressBar>
          </div>
        ) : (
          <IonCard>
            <IonCardHeader>
              <h4>Firebase Image Upload Hook</h4>
            </IonCardHeader>
            <IonCardContent>
              <AddImage
                imageChanged={d => {
                  setCurrentImage(d);
                }}

                uploadImage={onSaveImage}
              />
            </IonCardContent>
          </IonCard>
        )}
        {/* Renders the list on the page */}
        <div className="ion-padding">
          <ImageFileList />
        </div>
      </IonContent>
    </>
  );
}

export default Home;
