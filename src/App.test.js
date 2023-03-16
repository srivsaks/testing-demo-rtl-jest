import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";

describe("Inital render", () => {
  describe("It renders initial data", () => {
    it("Should render the submit button in the DOM and should have name class", () => {
      render(<App />);

      const buttonElement = screen.getByText("Submit Form");
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toBeEnabled();

      const inputContainer = screen.getByTestId("input-name");
      expect(inputContainer).toHaveClass("name");
    });

    it("Should render the input box in the DOM", () => {
      render(<App />);

      const inputText = screen.getByRole("textbox");
      expect(inputText).toBeInTheDocument();
    });

    it("Should not render loading text", () => {
      render(<App />);
      const loadingEle = screen.queryByText("Loading data...");
      expect(loadingEle).not.toBeInTheDocument();
    });
  });
});

describe("On Input", () => {
  describe("On input event on textbox", () => {
    it("Should have required elements in the DOM", () => {
      render(<App />);

      const buttonElement = screen.getByText("Submit Form");
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toBeEnabled();

      const inputText = screen.getByRole("textbox");
      expect(inputText).toBeInTheDocument();
      expect(inputText).toHaveValue("");

      const loadingEle = screen.queryByText("Loading data...");
      expect(loadingEle).not.toBeInTheDocument();

      expect(inputText).toHaveClass("name");
    });

    it("Should update the value in the input element", () => {
      render(<App />);
      const buttonElement = screen.getByText("Submit Form");
      const inputText = screen.getByRole("textbox");
      const loadingEle = screen.queryByText("Loading data...");

      /**
       * Firing input change event
       */
      fireEvent.input(inputText, { target: { value: "foo" } });

      expect(buttonElement).toBeEnabled();
      expect(buttonElement).toBeInTheDocument();

      expect(inputText).toHaveClass("name");

      expect(loadingEle).not.toBeInTheDocument();
      expect(inputText).toHaveValue("foo");
    });
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

    render(<App />);

    const buttonElement = screen.getByText("Submit Form");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();

    const inputText = screen.getByRole("textbox");
    expect(inputText).toBeInTheDocument();

    const loadingEle = screen.queryByText("Loading data...");
    expect(loadingEle).not.toBeInTheDocument();

    const dataEle = screen.queryByText("success");
    expect(dataEle).not.toBeInTheDocument();

    fireEvent.click(buttonElement);

    expect(buttonElement).toBeDisabled();

    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading data..."),
    );

    await waitFor(async () => {
      screen.getByText("success");
    });

    expect(buttonElement).toBeEnabled();
    expect(loadingEle).not.toBeInTheDocument();
    expect(screen.getByText("success")).toBeInTheDocument();

    global.fetch.mockClear();
    delete global.fetch;
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
    jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(setupFetchStub(fakeData));

    const { container } = render(<App />);

    const buttonElement = screen.getByText("Submit Form");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();

    const inputText = screen.getByRole("textbox");
    expect(inputText).toBeInTheDocument();

    const loadingEle = screen.queryByText("Loading data...");
    expect(loadingEle).not.toBeInTheDocument();

    expect(inputText).toHaveClass("name");

    fireEvent.click(buttonElement);

    expect(buttonElement).toBeDisabled();

    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading data..."),
    );

    await waitFor(async () => {
      screen.getByText("error occurred");
    });

    expect(buttonElement).toBeEnabled();
    expect(screen.getByText("error occurred")).toBeInTheDocument();
    expect(screen.queryByText("Loading data...")).not.toBeInTheDocument();

    global.fetch.mockClear();
    delete global.fetch;
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

    render(<App />);

    const buttonElement = screen.getByText("Submit Form");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();

    const inputText = screen.getByRole("textbox");
    expect(inputText).toBeInTheDocument();

    const loadingEle = screen.queryByText("Loading data...");
    expect(loadingEle).not.toBeInTheDocument();

    expect(inputText).toHaveClass("name");

    /**
     * Fire button click events
     */
    fireEvent.click(buttonElement);
    expect(buttonElement).toBeDisabled();

    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading data..."),
    );

    await waitFor(async () => {
      screen.getByText("error occurred again");
    });

    expect(buttonElement).toBeEnabled();
    expect(screen.getByText("error occurred again")).toBeInTheDocument();
    expect(screen.queryByText("Loading data...")).not.toBeInTheDocument();

    global.fetch.mockClear();
    delete global.fetch;
  });
});
