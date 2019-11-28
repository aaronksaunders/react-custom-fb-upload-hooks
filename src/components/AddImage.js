import React, { useState } from "react";
import "../App.css";
import { IonButton, IonIcon } from "@ionic/react";
import { trash, camera, cloudUpload } from "ionicons/icons";

import {
  Plugins,
  CameraSource,
  CameraResultType
} from "@capacitor/core";
const { Camera, Device } = Plugins;
/**
 *
 * @param {*} param0
 */
function AddImage({ imageChanged, uploadImage }) {
  const [imageThumb, setImageThumb] = useState("");

  /**
   * using Native Plugin
   */
  let takePicture = async () => {
    // Otherwise, make the call:
    try {
      const imageInfo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });
      // image.base64_data will contain the base64 encoded result as a JPEG,
      // with the data-uri prefix added
      let imagaData = {
        dataUrl: imageInfo.dataUrl,
        format: imageInfo.format,
        fileName: imageInfo.webPath || Date.now() + ".jpeg"
      };
      imageChanged(imagaData);
      setImageThumb(imagaData.dataUrl);
    } catch (e) {
      console.log("error", e);
      setImageThumb("");
      imageChanged(null);
      alert("Sorry, Camera API not supported");
    }
  };


  /**
   * clear local value tracking the selected image and emit
   * and event to the parent to indicate a change
   */
  let clearImage = () => {
    setImageThumb("");
    imageChanged({});
  };
 

  return (
    <div padding>
      {imageThumb && (
        <div className="pic-wrapper">
          <div className="pic">
            <img
              src={imageThumb}
              alt={""}
              style={{ "image-orientation": "from-image" }}
            />
          </div>
        </div>
      )}
      <div className="btn-wrapper">
        <IonButton onClick={takePicture}>
          <IonIcon slot="icon-only" icon={camera}></IonIcon>
        </IonButton>
        <IonButton onClick={uploadImage} color="secondary">
          <IonIcon slot="icon-only" icon={cloudUpload}></IonIcon>
        </IonButton>
        <IonButton onClick={clearImage} color="danger">
          <IonIcon slot="icon-only" icon={trash}></IonIcon>
        </IonButton>
      </div>
    </div>
  );
}

export default AddImage;
