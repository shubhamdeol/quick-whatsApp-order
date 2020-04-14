// Modal.js
import React from "react";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Modal,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  transparent: boolean;
  dismiss: () => void;
}

const MyModal: React.FC<Props> = ({
  children,
  visible,
  dismiss,
  transparent,
}) => {
  return (
    <View>
      <Modal
        visible={visible}
        transparent={transparent}
        onRequestClose={dismiss}
      >
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View>{children}</View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default MyModal;
