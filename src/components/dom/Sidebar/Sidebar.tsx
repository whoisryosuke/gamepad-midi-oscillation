import React from "react";
import styles from "./Sidebar.module.css";
import CameraAngleWidget from "./widgets/CameraAngleWidget";
import SynthSelectionWidget from "./widgets/SynthSelectionWidget";

type Props = {};

const Sidebar = (props: Props) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.content}>
        <CameraAngleWidget />
        <SynthSelectionWidget />
      </div>
    </div>
  );
};

export default Sidebar;
