import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast as BSToast } from "bootstrap";
import { removeMessage } from "../redux/toastSlice";

const TOAST_DURATION = 3000;

export default function Toast() {
    const messages = useSelector((state) => state.message.messages);
    const toastRefs = useRef({});
    const dispatch = useDispatch();

    useEffect(() => {
        messages.forEach((message) => {
            const toastElement = toastRefs.current[message.id];

            if (toastElement) {
                const toastInstance = new BSToast(toastElement);
                toastInstance.show();

                setTimeout(() => {
                    dispatch(removeMessage(message.id));
                }, TOAST_DURATION);
            }
        });
    }, [messages, dispatch]);

    const handleDismiss = (message_id) => {
        dispatch(removeMessage(message_id));
    };

    return(
        <div className="toast-container position-fixed  p-1 p-md-0" style={{zIndex: 2000, top:'60px', right:'20px'}}>
            {messages.map((message) => (
                <div className="toast " key={message.id} ref={(el) => (toastRefs.current[message.id] = el)}
                role="alert" aria-live="assertive" aria-atomic="true">
                    <div className={`toast-header ${message.status === "success" ? "bg-success": "bg-danger"} text-white`}>
                        <strong className="me-auto">{message.status === "success" ? "成功" : "失敗"}</strong>
                        <button onClick={() => handleDismiss(message.id)} className="btn-close" type="button" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">{message.text}</div>
                </div>
            ))}
        </div>
    )
}