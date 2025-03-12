import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, //MS
    sameSite: "strict", //CSRF
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};


export async function getCoordinates(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), long: parseFloat(data[0].lon) };
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
