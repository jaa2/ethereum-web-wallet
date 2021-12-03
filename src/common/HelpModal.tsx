import React from 'react';
import Modal from 'react-bootstrap/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export interface IHelpModalProps {
  title: string;
  description: string;
}

const HelpModal: React.FC<IHelpModalProps> = function HelpModal(props: IHelpModalProps) {
  const { title, description } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <FontAwesomeIcon className="fa-icon" icon={faQuestionCircle} onClick={showModal} cursor="pointer" />

      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
        </Modal.Header>
        <Modal.Body>
          <p>{description}</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HelpModal;
