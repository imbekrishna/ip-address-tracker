import Spinner from "./Spinner";

type InfoContainerProps = {
  label: string;
  value: string | undefined;
  loading: boolean;
};

export default function InfoContainer({
  label,
  value,
  loading,
}: InfoContainerProps) {
  return (
    <div className="ip-info-container">
      <div className="info-wrapper">
        <span>{label}</span>
        {loading ? <Spinner /> : <p>{value}</p>}
      </div>
    </div>
  );
}
