export interface ILoadingButtonProps {
  buttonId: string;
  buttonClasses: string[];
  buttonText: string;
  buttonOnClick: () => {};
  buttonEnabled: boolean;
  spin: boolean;
}

const LoadingButton:
React.FC<ILoadingButtonProps> = function LoadingButton(props: ILoadingButtonProps) {
  const {
    buttonId, buttonClasses, buttonText, buttonOnClick, buttonEnabled, spin,
  } = props;

  if (buttonEnabled || !spin) {
    return (
      <button id={buttonId} className={buttonClasses.join(' ')} type="button" onClick={buttonOnClick} disabled={!buttonEnabled}>{buttonText}</button>
    );
  }

  return (
    <span>
      <button id={buttonId} className={`${buttonClasses.join(' ')} position-relative`} type="button" disabled>
        <div className="invisible">
          {buttonText}
        </div>
        <div className="spinner-border text-primary position-absolute top-0 start-0 bottom-0 end-0 m-auto" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </button>
    </span>
  );
};

export default LoadingButton;
