export interface ILoadingButtonProps {
  buttonId: string;
  buttonClasses: string[];
  buttonText: string;
  buttonOnClick: () => {};
  buttonEnabled: boolean;
}

const LoadingButton:
React.FC<ILoadingButtonProps> = function LoadingButton(props: ILoadingButtonProps) {
  const {
    buttonId, buttonClasses, buttonText, buttonOnClick, buttonEnabled,
  } = props;

  if (buttonEnabled) {
    return (
      <button id={buttonId} className={buttonClasses.join(' ')} type="button" onClick={buttonOnClick}>{buttonText}</button>
    );
  }

  return (
    <span>
      <button id={buttonId} className={buttonClasses.join(' ')} type="button" disabled>
        <div className="spinner-border align-middle" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </button>
    </span>
  );
};

export default LoadingButton;
