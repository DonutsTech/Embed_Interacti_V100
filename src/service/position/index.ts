
export const positionCity = async (): Promise<{ COUNTRY: string; CITY: string; REGION: string } | undefined> => {
  try {
    const url = 'https://ipinfo.io/json';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return {
      COUNTRY: data.country,
      CITY: data.city,
      REGION: data.region,
    };
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
