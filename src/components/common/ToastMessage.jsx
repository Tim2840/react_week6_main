import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeMessage } from '../../store/slices/messageSlice';
import { Toast } from 'bootstrap';

function ToastMessage() {
  const messages = useSelector((state) => state.message.messages);
  const dispatch = useDispatch();
  
  // Create a ref attached to each toast by storing them in a map
  const toastRefs = useRef(new Map());

  // Automatically initialize and show bootstrap toast when newly added
  useEffect(() => {
    messages.forEach((msg) => {
      const toastElement = toastRefs.current.get(msg.id);
      if (toastElement) {
        let bsToast = Toast.getInstance(toastElement);
        if (!bsToast) {
          bsToast = new Toast(toastElement, {
            delay: 3000,
          });
          bsToast.show();

          // Listen for visually hidden event to clear from redux
          toastElement.addEventListener('hidden.bs.toast', () => {
             dispatch(removeMessage(msg.id));
          });
        }
      }
    });
  }, [messages, dispatch]);

  const setObjRef = (id, el) => {
    if (el) {
      toastRefs.current.set(id, el);
    } else {
      toastRefs.current.delete(id);
    }
  };

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          ref={(el) => setObjRef(message.id, el)}
          className={`toast border-0`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className={`toast-header text-white bg-${message.type}`}>
            <strong className="me-auto">{message.title}</strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          {message.text && (
            <div className="toast-body bg-white rounded-bottom">
              {message.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ToastMessage;
