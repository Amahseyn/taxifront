import styles from "./PricingCalculator.module.css";

export default function PricingCalculator() {
  const routes = [
    { airport: "Stansted", code: "STN", saloon: 75, suv: 90, minibus: 120 },
    { airport: "Southend", code: "SEN", saloon: 85, suv: 100, minibus: 135 },
    { airport: "London City", code: "LCY", saloon: 125, suv: 140, minibus: 150 },
    { airport: "Norwich", code: "NWI", saloon: 130, suv: 145, minibus: 150 },
    { airport: "Heathrow", code: "LHR", saloon: 160, suv: 175, minibus: 225 },
    { airport: "Gatwick", code: "LGW", saloon: 160, suv: 175, minibus: 225 },
    { airport: "Luton", code: "LTN", saloon: 160, suv: 175, minibus: 225 },
    { airport: "Birmingham", code: "BHX", saloon: 250, suv: 270, minibus: 290 },
    { airport: "East Midlands", code: "EMA", saloon: 250, suv: 270, minibus: 290 },
    { airport: "Leeds/Bradford", code: "LBA", saloon: 355, suv: 370, minibus: 400 },
    { airport: "Manchester", code: "MAN", saloon: 355, suv: 370, minibus: 450 },
    { airport: "Liverpool", code: "LPL", saloon: 370, suv: 390, minibus: 470 },
  ];

  return (
    <div>
      <p className={styles.note}>
        Prices are calculated based on departures from <em>Colchester</em>
      </p>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Airport</th>
              <th className={styles.th}>Code</th>
              <th className={styles.th}>Saloon</th>
              <th className={styles.th}>SUV</th>
              <th className={styles.th}>Minibus</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r, i) => (
              <tr key={`rate-${i}`} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.airportName}>{r.airport}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.code}>{r.code}</span>
                </td>
                <td className={`${styles.td} ${styles.price}`}>£{r.saloon}</td>
                <td className={`${styles.td} ${styles.price}`}>£{r.suv}</td>
                <td className={`${styles.td} ${styles.price}`}>£{r.minibus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
