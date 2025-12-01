from typing import List, Dict

import pandas as pd
from prophet import Prophet

from .models import WeatherObservation


def build_prophet_forecast(
    city_id: int,
    periods: int = 24,
    freq: str = "H",
) -> List[Dict]:
    qs = (
        WeatherObservation.objects
        .filter(city_id=city_id)
        .order_by("timestamp")
    )

    if not qs.exists():
        return []

    df = pd.DataFrame.from_records(
        qs.values("timestamp", "temperature"),
        columns=["timestamp", "temperature"],
    )

    # Prophet espera ds (fecha) y y (valor)
    df.rename(columns={"timestamp": "ds", "temperature": "y"}, inplace=True)

    # 👇 Quitar timezone de ds (Django usa aware datetimes, Prophet no los soporta)
    df["ds"] = pd.to_datetime(df["ds"])
    try:
        df["ds"] = df["ds"].dt.tz_localize(None)
    except TypeError:
        # Si ya era naive, no pasa nada
        pass

    model = Prophet()
    model.fit(df)

    future = model.make_future_dataframe(periods=periods, freq=freq)
    forecast = model.predict(future)

    result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(periods)

    return [
        {
            "ts": row["ds"].isoformat(),
            "yhat": float(row["yhat"]),
            "yhat_lower": float(row["yhat_lower"]),
            "yhat_upper": float(row["yhat_upper"]),
        }
        for _, row in result.iterrows()
    ]
