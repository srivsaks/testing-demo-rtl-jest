import { fireEvent, render, screen, waitFor,waitForElementToBeRemoved } from "@testing-library/react";
import App from "./App";

describe("Inital render", () => {
  it("Tests intial data", () => {
    const { container } = render(<App />);

    const buttonElement = screen.getByText("Submit Form");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();

    const inputText = screen.getByRole("textbox");
    expect(inputText).toBeInTheDocument();

    const loadingEle = screen.queryByText("Loading data...");
    expect(loadingEle).not.toBeInTheDocument();

    expect(container.firstChild.classList.contains("name"));
  });
});

describe("On Input", () => {
  it("Tests on Input event", () => {
    const { container } = render(<App />);

    const buttonElement = screen.getByText("Submit Form");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();

    const inputText = screen.getByRole("textbox");
    expect(inputText).toBeInTheDocument();
    expect(inputText).toHaveValue("");

    const loadingEle = screen.queryByText("Loading data...");
    expect(loadingEle).not.toBeInTheDocument();

    expect(container.firstChild.classList.contains("name"));

    fireEvent.input(inputText, { target: { value: "foo" } });

    expect(buttonElement).toBeEnabled();
    expect(buttonElement).toBeInTheDocument();
    expect(container.firstChild.classList.contains("name"));
    expect(loadingEle).not.toBeInTheDocument();
    expect(inputText).toHaveValue("foo");
  });
});

describe("On Button Click", () => {
  
  it("Tests button click with API success", async () => {
    function setupFetchStub() {
      return function fetchStub(_url) {
        return new Promise((resolve) => {
          resolve({
            json: () =>
              Promise.resolve({
                status: "success",
              }),
          });
        });
      };
    }

    global.fetch = jest.fn().mockImplementationOnce(setupFetchStub());
    jest.spyOn(global, "fetch").mockImplementationOnce(setupFetchStub());

    const { container } = render(<App />);

    const buttonElement = screen.getByText("Submit Form");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();

    const inputText = screen.getByRole("textbox");
    expect(inputText).toBeInTheDocument();

    const loadingEle = screen.queryByText("Loading data...");
    expect(loadingEle).not.toBeInTheDocument();

    const dataEle = screen.queryByText("success");
    expect(dataEle).not.toBeInTheDocument();

    expect(container.firstChild.firstChild.classList.contains("name"));

    fireEvent.click(buttonElement);

    await waitForElementToBeRemoved(() =>screen.queryByText("Loading data..."));
    await waitFor(async () => {
      // fireEvent.click(buttonElement);
      expect(buttonElement).toBeEnabled();
      expect(loadingEle).not.toBeInTheDocument();
      expect(container.firstElementChild.children[0].innerHTML).toEqual("success")
    });

    // const newDataEle=await screen.queryByText("sucess");

   // expect(buttonElement).toBeEnabled()
  //  expect(container.firstElementChild.children[0].innerHTML).toEqual("success")
   /*expect(buttonElement).toBeEnabled()
    console.log(dataEle);
    expect(container.firstChild.classList.contains("response"));
    expect(container.firstElementChild.children[0].innerHTML).toEqual(
      "success"
    );

    expect(buttonElement).toBeEnabled();*/
    global.fetch.mockClear();
    delete global.fetch
  });
  
  it("Tests button click with API failiure", async () => {
    function setupFetchStub(data) {
      return function fetchStub(_url) {
        return new Promise((_, reject) => {
          reject(data);
        });
      };
    }
    const fakeData = { message: "error occurred" };
    global.fetch = jest.fn().mockImplementationOnce(setupFetchStub(fakeData));
    jest.spyOn(global, "fetch").mockImplementationOnce(setupFetchStub(fakeData));

    const { container } = render(<App />);

    const buttonElement = screen.getByText("Submit Form");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();

    const inputText = screen.getByRole("textbox");
    expect(inputText).toBeInTheDocument();

    const loadingEle = screen.queryByText("Loading data...");
    expect(loadingEle).not.toBeInTheDocument();

    expect(container.firstChild.classList.contains("name"));

    fireEvent.click(buttonElement);

    await waitForElementToBeRemoved(() =>screen.queryByText("Loading data..."));
    await waitFor(async () => {
       expect(buttonElement).toBeEnabled()
    expect(container.firstChild.classList.contains("response"));
    expect(container.firstElementChild.firstChild.innerHTML).toEqual(
      "error occurred"
    );
      // expect(container.firstChild.textContent).toEqual("success");
    });

    /*expect(buttonElement).toBeEnabled()
    expect(container.firstChild.classList.contains("response"));
    expect(container.firstElementChild.firstChild.innerHTML).toEqual(
      "error occurred"
    );*/

    //expect(container.firstChild.textContent).toEqual("success");
    global.fetch.mockClear();
    delete global.fetch
  });

  it("Tests button click with API failiure from json object", async () => {
    function setupFetchStub() {
      return function fetchStub(_url) {
        return new Promise((resolve) => {
          resolve({
            json: () =>
              Promise.reject({
                message: "error occurred again",
              }),
          });
        });
      };
    }
    global.fetch = jest.fn().mockImplementationOnce(setupFetchStub());
    jest.spyOn(global, "fetch").mockImplementationOnce(setupFetchStub());

    const { container } = render(<App />);

    const buttonElement = screen.getByText("Submit Form");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();

    const inputText = screen.getByRole("textbox");
    expect(inputText).toBeInTheDocument();

    const loadingEle = screen.queryByText("Loading data...");
    expect(loadingEle).not.toBeInTheDocument();

    expect(container.firstChild.classList.contains("name"));

    fireEvent.click(buttonElement);

    await waitForElementToBeRemoved(() =>screen.queryByText("Loading data..."));
    await waitFor(async () => {
      expect(buttonElement).toBeEnabled()
      // fireEvent.click(buttonElement);
      // expect(buttonElement).toBeDisabled();
      expect(container.firstElementChild.firstChild.innerHTML).toEqual(
        "error occurred again"
      );
      /*expect(container.firstElementChild.firstChild.innerHTML).toEqual(
        "Loading data..."
      );*/
    });

    /*expect(container.firstElementChild.firstChild.innerHTML).toEqual(
      "error occurred again"
    );
    expect(buttonElement).toBeEnabled();
    expect(container.firstChild.classList.contains("response"));*/

    global.fetch.mockClear();
    delete global.fetch
  });

  
});
