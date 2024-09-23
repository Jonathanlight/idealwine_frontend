import { SliceZone } from "@prismicio/react";
import { SliceSimulator } from "@prismicio/slice-simulator-react";

import { components } from "@/slices";

const SliceSimulatorPage = (): JSX.Element => (
  <SliceSimulator
    sliceZone={({ slices }) => <SliceZone slices={slices} components={components} />}
    state={{}}
  />
);

export const getServerSideProps = () => ({
  notFound: process.env.NODE_ENV === "production",
});

export default SliceSimulatorPage;
