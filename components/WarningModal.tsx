import { Button, Modal, Text } from "@mantine/core";
import React from "react";

function WarningModal({
  onClose,
  onCloseAll,
}: {
  onClose: () => void;
  onCloseAll: () => void;
}) {
  return (
    <>
      <Text size="md" mt={10}>
        Are you sure you want to close this window? <br />
        <span className="text-red-600 font-bold">
          Changes will not be saved
        </span>
      </Text>

      <div className="flex justify-between mt-4">
        <div></div>

        <div className="flex gap-2">
          <Button
            color="gray.2"
            classNames={{
              label: "!text-black",
            }}
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>

          <Button
            color="red"
            onClick={() => {
              onCloseAll();
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
}

export default WarningModal;
