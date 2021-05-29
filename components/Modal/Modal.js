import React from 'react';
import classes from './Modal.module.css';

const Modal = React.memo(props => {
  return (
    <React.Fragment>
        <div className={classes.modalBackground}>

        </div>

      {/* <div className="backdrop" onClick={props.onClose} />
      <div className="modal">
        <h2>{props.title}</h2>
        {props.body}
        <div className="modal__actions">
          <button type="button" onClick={props.onClose}>
            Close
          </button>
        </div>
      </div> */}
    </React.Fragment>
  );
});

export default Modal;
