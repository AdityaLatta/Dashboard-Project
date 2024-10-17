import React from "react";

const Logout = ({
  children,
  dialog,
}: {
  children: React.ReactNode;
  dialog: React.RefObject<HTMLDialogElement>;
}) => {
  return (
    <>
      <dialog
        ref={dialog}
        className="rounded-lg p-4 shadow-lg backdrop:bg-black backdrop:opacity-65"
      >
        <p>Are you sure you want to log out?</p>
        {children}
      </dialog>
    </>
  );
};

export default Logout;
