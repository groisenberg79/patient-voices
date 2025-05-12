import { useParams } from 'react-router-dom';

function DiseasePage() {
  const { id } = useParams();

  return (
    <div>
      <h2>Disease ID: {id}</h2>
      <p>[Reviews will go here...]</p>
    </div>
  );
}

export default DiseasePage;