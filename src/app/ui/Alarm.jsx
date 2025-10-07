import { useState, useRef, useEffect } from "react";

export default function Alarm({alarmData}){
  const [isResolved, setResolved] = useState(false);
  const closeRef = useRef();
  const modalRef = useRef();

  const resolveClick = (e) => {
    setResolved(true);
    alarmData.resolve(e.target.getAttribute("status"));
    setTimeout(() => {closeRef.current.click(); setResolved(false);}, 4);
  };

  const rejectClick = () => {
    if(!isResolved){
      alarmData.reject();
    }
  }

  useEffect(() => {
        modalRef.current.addEventListener('hide.bs.modal', rejectClick);
        return () => {
            if(modalRef.current) {
                modalRef.current.removeEventListener('hide.bs.modal', rejectClick);
            }
        }
    }, [alarmData]);

    
  const btnClasses = ["btn-primary", "btn-secondary", "btn-success", "btn-info", "btn-warning"]

  return <div ref={modalRef} className="modal fade" id="alarmModal" tabIndex="-1" aria-labelledby="alarmModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="alarmModalLabel">
            <div className="d-flex align-items-center">
            {alarmData.icon && <>
                    {
                        alarmData.icon === "info" ? <i className="bi bi-info-circle text-primary fs-4"></i>
                        : alarmData.icon === "warning" ? <i className="bi bi-exclamation-triangle text-warning fs-4"></i>
                        : <i className="bi bi-sign-stop text-danger fs-4"></i>
                    }
                    &nbsp; &nbsp; 
                  </>
            }
            {alarmData.title}
            </div>
          </h1>
          <button onClick={rejectClick} ref={closeRef} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
          </button>
        </div>
        <div className="modal-body">
            {alarmData.message}
        </div>
        <div className="modal-footer">
          {typeof alarmData.buttons == 'object' &&
          alarmData.buttons.map((btn, index) => 
          <button 
            key={btn.status} status={btn.status} onClick={resolveClick} 
            type="button" 
            className={"btn " + (
                (btn.status === "warning" || btn.status === "danger" || btn.status === "secondary") ? "btn-" + btn.status
                : btnClasses[index % btnClasses.length]
                )}>
            {btn.title}
          </button>)
          }
        </div>
      </div>
    </div>
  </div>;
}