import React from "react";
import { Modal, Button } from "react-bootstrap";
import './confirmation-dialog.scss'
const ConfirmationDialog = ({ show, handleClose, handleConfirm }) => {
    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-bottom">
                    <Modal.Title className="dialog-title">
                        Confirm Delete
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="mb-0">
                        Are you sure you want to{" "}
                        <strong className={"text-danger"}>
                            Delete
                        </strong>{" "}
                        this program type?
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-top">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant={"danger"}
                        onClick={handleConfirm}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ConfirmationDialog