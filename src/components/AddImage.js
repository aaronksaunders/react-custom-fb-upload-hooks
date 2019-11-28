import React, { useState } from "react";
import "../App.css";
import {
  IonButton,
  IonIcon
} from "@ionic/react";
import { trash, camera, cloudUpload } from "ionicons/icons";
/**
 *
 * @param {*} param0
 */
function AddImage({ imageChanged, uploadImage }) {
  const [imageThumb, setImageThumb] = useState("");

  // FILE IMAGE STUFF
  /**
   * used to fake a click event on the file upload input element
   */
  let openFileDialog = () => {
    document.getElementById("file-upload").value = "";
    document.getElementById("file-upload").click();
  };
  /**
   * clear local value tracking the selected image and emit
   * and event to the parent to indicate a change
   */
  let clearImage = () => {
    setImageThumb("");
    imageChanged({});
  };
  /**
   * this is called when the user selects a file from the
   * opened dialog
   */
  let handleImageChanged = e => {
    const file = e.target.files[0];
    if (!file.type.includes("image/")) {
      alert("Please select an image file");
      return;
    }
    if (typeof FileReader === "function") {
      const reader = new FileReader();
      reader.onload = event => {
        let imagaData = {
          dataUrl: event.target.result,
          format: file.type.split("/")[1],
          fileName: file.name
        };
        imageChanged(imagaData);
        setImageThumb(imagaData.dataUrl);
      };

      reader.onerror = _error => {
        setImageThumb("");
        imageChanged(null);
        console.log(_error);
      };
      reader.readAsDataURL(file);
    } else {
      setImageThumb("");
      imageChanged(null);
      alert("Sorry, FileReader API not supported");
    }
  };

  return (
    <div padding>
      {imageThumb && (
        <div className="pic-wrapper">
          <div className="pic">
            <img src={imageThumb} alt={""} />
          </div>
        </div>
      )}
      <div className="btn-wrapper">
        <input
          type="file"
          id="file-upload"
          style={{ display: "none" }}
          onChange={handleImageChanged}
        />
        <IonButton onClick={openFileDialog}>
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
