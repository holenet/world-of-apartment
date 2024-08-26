const BASE_URL = import.meta.env.BASE_URL;

export function Logo() {
  return <img class="w-full" src={`${BASE_URL}logo.png`} />;
}
