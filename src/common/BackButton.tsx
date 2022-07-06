import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button type="button" className="btn back-icon" onClick={() => navigate(-1)}>
      <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
    </button>
  );
}
