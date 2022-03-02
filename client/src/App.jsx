import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { css } from "@emotion/react";
import { useState } from "react";
import axios from "axios";

import config from "./config.json";

const ContainerBox = styled(Box)`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenterPaper = styled(Paper)`
  width: 500px;
  padding: 10px;
`;

const StyledField = styled(TextField)`
  margin: 5px;
`;

const Form = styled(Box)`
  position: relative;
`;

const SubmitButton = styled(Button)`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

function validateField(name, value) {
  if (!value || value === "")
    return { isValid: false, errMessage: "Field is required" };

  let re;
  let errMessage;

  switch (name) {
    case "cardNumber":
      re = "^\\d{16}$";
      errMessage = "Credit number must consist of 16 digits without spaces";
      break;
    case "cvv":
      re = "^\\d{3}$";
      errMessage = "CVV must consist of 3 digits";
      break;
    case "expirationDate":
      re = "^(0[1-9]|1[0-2])\\/?([0-9]{4})$";
      errMessage = "Date must be in MM/YYYY format";
      break;
    case "amount":
      re = "^\\d*$";
      errMessage = "Amount must be a number";
      break;
    default:
      throw new Error("Invalid field name");
  }

  const isValid = new RegExp(re).test(value);

  return { isValid, errMessage: isValid ? "" : errMessage };
}

export default function App() {
  const initialState = {
    isValid: true,
    errMessage: "",
    value: "",
  };

  const [state, setState] = useState({
    cardNumber: initialState,
    cvv: initialState,
    expirationDate: initialState,
    amount: initialState,
  });

  const [response, setResponse] = useState(null);

  const onBlurHandler = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: {
        ...validateField(e.target.name, e.target.value),
        value: e.target.value,
      },
    }));
  };

  const onChangeHandler = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: { ...prevState[e.target.name], value: e.target.value },
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setState((prevState) => {
      let result = {};

      Object.entries(prevState).forEach(([key, value]) => {
        result[key] = {
          ...validateField(key, value.value),
          value: value.value,
        };
      });

      return result;
    });

    if (
      !Object.entries(state)
        .map(([key, value]) => {
          console.log(value);
          return validateField(key, value.value).isValid;
        })
        .every((item) => item)
    )
      return;

    const res = await axios.post(
      config.apiUrl + "/payments",
      Object.fromEntries(
        Object.entries(state).map(([key, value]) => [key, value.value])
      )
    );

    setResponse(JSON.stringify(res.data));
  };

  return (
    <ContainerBox>
      <CenterPaper elevation={3}>
        <Form
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={onSubmitHandler}
        >
          <StyledField
            label="Card number"
            name="cardNumber"
            required
            fullWidth
            css={css`
              box-sizing: border-box;
              padding-right: 10px;
            `}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            error={!state.cardNumber.isValid}
            helperText={state.cardNumber.errMessage}
            value={state.cardNumber.value}
          />
          <StyledField
            label="CVV"
            name="cvv"
            required
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            error={!state.cvv.isValid}
            helperText={state.cvv.errMessage}
            value={state.cvv.value}
          />
          <StyledField
            label="Expiration date"
            name="expirationDate"
            required
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            error={!state.expirationDate.isValid}
            helperText={state.expirationDate.errMessage}
            value={state.expirationDate.value}
          />
          <StyledField
            label="Amount"
            name="amount"
            required
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            error={!state.amount.isValid}
            helperText={state.amount.errMessage}
            value={state.amount.value}
          />
          <SubmitButton
            variant="contained"
            type="submit"
            disabled={!Object.values(state).every((item) => item.isValid)}
          >
            Submit
          </SubmitButton>
        </Form>
        <Typography>{response}</Typography>
      </CenterPaper>
    </ContainerBox>
  );
}
