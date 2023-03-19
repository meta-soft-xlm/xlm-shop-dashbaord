import { Icon, useBreakpointValue } from "@chakra-ui/react";
const Blur = (props) => {
  return (
    <Icon
      width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="61" r="111" fill="#5171ed" />
      <circle cx="244" cy="106" r="139" fill="#7061ed" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#662d8f" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#222222" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#662d8f" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#222222" />
    </Icon>
  );
};

export default Blur;
