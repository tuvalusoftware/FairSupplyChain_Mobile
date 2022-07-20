import React from 'react';
import ConfirmSheet from '../../components/ConfirmSheet';
export default function ConfirmCreateSheet({isOpen, onClose, onOk, ...orther}) {
  return (
    <ConfirmSheet
      isOpen={isOpen}
      onClose={onClose}
      onOk={onOk}
      title="Are you sure to send request ?"
      description="Once confirmed the connected application can send your document for
      verification"
      icon="send-clock"
      {...orther}
    />
  );
}
