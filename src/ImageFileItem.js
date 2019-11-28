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
  const displayThumb = () =>
    data.thumb && (
      <img
        src={data.thumb}
        alt={""}
        width="100"
        slot="start"
        style={{ marginRight: 10 }}
        // style={{marginInlineStart: 12}}
      />
    );

  const displayTime = () =>
    data.createdOn &&
    new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    }).format(data.createdOn.toDate());

  return (
    data && (
      <IonItemSliding>
        <IonItem>
          {displayThumb()}
          <IonLabel class="ion-text-wrap">
            <IonText className="thing-title">
              <div>{data.name}</div>
            </IonText>
            <IonText className="thing-sub-title">
              <div>{displayTime()}</div>
            </IonText>
            <div className="thing-id">{data.id}</div>
            {/* <div style={{ fontSize: "xx-small" }}>{data.downloadUrl}</div> */}
          </IonLabel>
          <div></div>
        </IonItem>
        <IonItemOptions side="end">
          <IonItemOption color="danger" onClick={() => doDelete(data.id)}>
            <IonIcon slot="icon-only" icon={trash}></IonIcon>
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    )
  );
}
