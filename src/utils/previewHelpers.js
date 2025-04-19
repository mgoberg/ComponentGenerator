// Modal test wrapper to ensure modals are visible in the preview
function ModalWrapper({ children }) {
  return React.createElement(
    "div",
    {
      className: "modal-test-wrapper",
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
    },
    children
  );
}

// Button that can trigger modal visibility
function ModalTrigger({ onClick, children }) {
  return React.createElement(
    "button",
    {
      onClick,
      style: {
        padding: "10px 15px",
        background: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      },
    },
    children || "Open Modal"
  );
}
