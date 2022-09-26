import StopView from './StopView';

const Stops = ({ stops, onPress }) => {
  if (!stops) return null;

  return (
    <>
      {stops.map((s) => (
        <StopView key={s.ID} stop={s} onPress={onPress} />
      ))}
    </>
  );
};

export default Stops;
