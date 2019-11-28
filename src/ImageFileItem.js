import React from "react";
import "./App.css";
import {
  IonItem,
  IonLabel,
  IonText,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonIcon
} from "@ionic/react";
import { trash } from "ionicons/icons";
/**
 * 
 * @param {*} param0 
 */
export default function ImageFileItem({ doDelete, data }) {
  return data && (
    <IonItemSliding>
      <IonItem>
        <IonLabel class="ion-text-wrap">
          <IonText className="thing-title">
            <div>{data.name}</div>
          </IonText>
          <IonText className="thing-sub-title">
            <div>{data.createdOn && data.createdOn.toDate() + ""}</div>
          </IonText>
          <div className="thing-id">{data.id}</div>
          <div style={{fontSize: 'xx-small'}}>{data.downloadUrl}</div>
        </IonLabel>
        <div></div>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={() => doDelete(data.id)}>
          <IonIcon slot="icon-only" icon={trash}></IonIcon>
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
}
