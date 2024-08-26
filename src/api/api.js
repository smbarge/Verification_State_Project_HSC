import { divisionCode, loginName, token } from "../stores/stores";
let apiServer = import.meta.env.VITE_APISERVER;
import { get } from "svelte/store";

const getUserInfo = async () => {
  const currentToken = get(token);

  let url = new URL(`${apiServer}/userInfo`);
  // console.log("url is :", url);
  console.log("token ", currentToken);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, userInfo } = responseResult;
    return { error, errorMsg, userInfo };
  } catch (e) {
    // console.log("api.getUserInfo failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getAllUIDList = async ({ divisionCode, selectCard }) => {
  // console.log("divisionCode is ", divisionCode);
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/paperPuller/getAllUIDList/${divisionCode}/${selectCard}`
  );
  // console.log("url is :", url);
  // console.log("Current token ",currentToken);
  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, allUIDList, totalCount } = responseResult;
    return { error, errorMsg, allUIDList, totalCount };
  } catch (e) {
    // console.log("api.getALLUIDList failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getSubjectWiseUIDList = async ({
  batchNumber,
  activeCardIndex,
  divisionCode,
}) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", batchNumber);
  let url = new URL(
    `${apiServer}/paperPuller/getSubjectWiseUIDList/${batchNumber}/${activeCardIndex}/${divisionCode}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, subjectWiseUIDList } = responseResult;
    return { error, errorMsg, subjectWiseUIDList };
  } catch (e) {
    // console.log("api.getSubjectWiseUIDList failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getDivisionMaster = async ({}) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/paperPuller/getDivisionMaster`);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, divisionMaster } = responseResult;
    return { error, errorMsg, divisionMaster };
  } catch (e) {
    // console.log("api.getDivisionMaster failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const addBatch = async ({ divnCode, createdBy, recheck_type }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/paperPuller/liveBatch`);
  // console.log("url is :", url);
  // console.log("token ", currentToken);
  let params = { divnCode, createdBy, recheck_type };
  // console.log('params is',params)
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, insertedCount, subjectWiseUIDList } =
      responseResult;
    return { error, errorMsg, insertedCount, subjectWiseUIDList };
  } catch (e) {
    // console.log("api.getDivisionMaster failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getUIDWiseData = async ({
  batchNumber,
  activeCardIndex,
  divisionCode,
}) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", batchNumber);
  let url = new URL(
    `${apiServer}/paperPuller/getUIDWiseData/${batchNumber}/${activeCardIndex}/${divisionCode}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, uIdList } = responseResult;
    return { error, errorMsg, uIdList };
  } catch (e) {
    // console.log("api.getUIDWiseData failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const updatePaperStatus = async ({ batchNumber, uIdMaster, divisionCode }) => {
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/paperPuller/updatePaperStatus/${divisionCode}`
  );
  // console.log("url is :", url);
  let params = { batchNumber, uIdMaster };
  // console.log("params is ", params);
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, paperStatus } = responseResult;
    return { error, errorMsg, paperStatus };
  } catch (e) {
    // console.log("api.updatePaperStatus failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const saveHandOverList = async ({ batchNumber, uIdMaster, requestBy }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/paperPuller/saveHandOverList`);
  // console.log("url is :", url);
  let params = { batchNumber, uIdMaster, requestBy };
  // console.log("params is ", params);
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, handOverList } = responseResult;
    return { error, errorMsg, handOverList };
  } catch (e) {
    // console.log("api.saveHandOverList is  failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getAllHandOverList = async ({ division }) => {
  const currentToken = get(token);
  // console.log("Division is... ", division);
  let url = new URL(`${apiServer}/paperPuller/getAllHandOverList/${division}`);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, handOverList } = responseResult;
    return { error, errorMsg, handOverList };
  } catch (e) {
    // console.log("api.getAllHandoverList failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getHandoverData = async ({ reqId }) => {
  const currentToken = get(token);
  // console.log("Division is... ", reqId);
  let url = new URL(`${apiServer}/paperPuller/getHandoverData/${reqId}`);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, UidData } = responseResult;
    // console.log("Responce is ",responseResult);
    return { error, errorMsg, UidData };
    // console.log(UidData);
  } catch (e) {
    // console.log("api.getHandoverdData failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getHandoverRequestsForDivision = async ({ divnCode }) => {
  const currentToken = get(token);
  // console.log("Division is... ", divnCode);
  let url = new URL(
    `${apiServer}/casePaperCreator/getHandoverRequestsForDivision/${divnCode}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, handoverRequests } = responseResult;
    // console.log("Responce is ",responseResult);
    return { error, errorMsg, handoverRequests };
    // console.log(UidData);
  } catch (e) {
    // console.log("api.getHandoverRequestsForDivision failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const acceptHandoverRequest = async ({ divnCode, reqId }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/casePaperCreator/acceptHandoverRequest`);
  // console.log("url is :", url);
  let params = { divnCode, reqId };
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
  } catch (e) {
    // console.log("api.acceptHandoverRequest failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const rejectHandoverRequest = async ({ divnCode, reqId }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/casePaperCreator/rejectHandoverRequest`);
  // console.log("url is :", url);
  let params = { divnCode, reqId };
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
  } catch (e) {
    // console.log("api.rejectHandoverRequest failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getCaseLot = async ({ division }) => {
  const currentToken = get(token);
  // console.log("Division is... ", division);
  let url = new URL(`${apiServer}/casePaperCreator/getCaseLot/${division}`);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, lotList } = responseResult;
    // console.log("Responce is ",responseResult);
    return { error, errorMsg, lotList };
    // console.log(UidData);
  } catch (e) {
    // console.log("api.getHandoverRequestsForDivision failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getCaseListForDivision = async ({ division }) => {
  const currentToken = get(token);
  // console.log("Division is... ", division);
  let url = new URL(
    `${apiServer}/casePaperCreator/getCaseListForDivision/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, caseList } = responseResult;
    return { error, errorMsg, caseList };
  } catch (e) {
    // console.log("api.getCaseListForDivision failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getLotDetails = async ({ batchNumber, recheckType, divnCode }) => {
  const currentToken = get(token);
  // console.log("lotNo is... ", batchNumber);
  let url = new URL(
    `${apiServer}/casePaperCreator/getLotDetails/${batchNumber}/${recheckType}/${divnCode}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, lotDetails } = responseResult;
    return { error, errorMsg, lotDetails };
    // console.log(UidData);
  } catch (e) {
    // console.log("api.getHandoverRequestsForDivision failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const saveCaseLot = async ({ saveList }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/casePaperCreator/saveCaseLot`);
  let params = { saveList };
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, result, lotNo } = responseResult;
    return { error, errorMsg, result, lotNo };
    // console.log(UidData);
  } catch (e) {
    // console.log("api.saveCaseLot failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const updateCaseLot = async ({ updateList }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/casePaperCreator/updateCaseLot`);
  let params = { updateList };
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
    // console.log(UidData);
  } catch (e) {
    // console.log("api.updateCaseLot failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const updateLotStatus = async ({ updateList }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/casePaperPresentor/updateLotStatus`);
  let params = { updateList };
  // console.log("PARAms is :", params);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
    // console.log(UidData);
  } catch (e) {
    // console.log("api.saveCaseLot failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getHandoverLot = async ({ division }) => {
  const currentToken = get(token);
  // console.log("divisionCode is... ", division);
  let url = new URL(
    `${apiServer}/casePaperPresentor/getHandoverLot/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, lots } = responseResult;
    return { error, errorMsg, lots };
    // console.log(UidData);
  } catch (e) {
    // console.log("api.getHandoverLot failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getAcceptedLot = async ({ division }) => {
  const currentToken = get(token);
  // console.log("divisionCode is... ", division);
  let url = new URL(
    `${apiServer}/casePaperPresentor/getAcceptedLot/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, lots } = responseResult;
    // console.log("LotDetails in api is ", lots);
    return { error, errorMsg, lots };
    // console.log(UidData);
  } catch (e) {
    // console.log("api.getAcceptedLot failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const updateDecision = async ({ recheckCaseId }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/casePaperPresentor/updateDecision`);
  let params = { recheckCaseId };
  // console.log("Params is :", params);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
    // console.log(UidData);
  } catch (e) {
    // console.log("api.saveCaseLot failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getHandoverCases = async ({ division }) => {
  const currentToken = get(token);
  // console.log("divisionCode is... ", division);
  let url = new URL(
    `${apiServer}/casePaperPresentor/getHandoverCases/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, recheckCases } = responseResult;
    // console.log("getHandoverCases in api is ", recheckCases);
    return { error, errorMsg, recheckCases };
    // console.log(UidData);
  } catch (e) {
    console.log("api.getHandoverCases failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const updateHandoverCases = async ({ recheckCases }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/casePaperPresentor/updateHandoverCases`);
  let params = { recheckCases };
  // console.log("Params is :", params);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
    // console.log(UidData);
  } catch (e) {
    console.log("api.saveCaseLot failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getHandoveredCases = async ({ division }) => {
  const currentToken = get(token);
  // console.log("divisionCode is... ", division);
  let url = new URL(
    `${apiServer}/photoCopyMaker/getHandoveredCases/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, recheckCases } = responseResult;
    // console.log("getHandoverCases in api is ", recheckCases);
    return { error, errorMsg, recheckCases };
    // console.log(UidData);
  } catch (e) {
    console.log("api.getHandoverCases failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const updateCaseStatus = async ({ updateList }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/photoCopyMaker/updateCaseStatus`);
  let params = { updateList };
  // console.log("Params is :", params);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
    // console.log(UidData);
  } catch (e) {
    console.log("api.updateCaseStatus failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getAcceptedCases = async ({ division }) => {
  const currentToken = get(token);
  // console.log("divisionCode is... ", division);
  let url = new URL(`${apiServer}/photoCopyMaker/getAcceptedCases/${division}`);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, recheckCases } = responseResult;
    // console.log("getHandoverCases in api is ", recheckCases);
    return { error, errorMsg, recheckCases };
    // console.log(UidData);
  } catch (e) {
    console.log("api.getHandoverCases failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const uploadFile = async ({ formData, uid }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/photoCopyMaker/uploadAnswerSheet/${uid}`);
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      body: formData,
    });

    if (reply.status != 200) {
      let resp = await reply.json();
      let { error, message } = resp;
      // console.log("responce on error is: ", resp);
      throw Error(message);
    }

    const { filename } = await reply.json();
    return { error: 0, errorMsg: "", filename };
  } catch (e) {
    console.log("api.uploadFile failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const uploadFileForChange = async ({ formData, recheckCaseId }) => {
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/casePaperPresentor/uploadChangeReport/${recheckCaseId}`
  );
  try {
    // console.log("recheckCaseId su....", recheckCaseId);
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      body: formData,
    });

    if (reply.status != 200) {
      let resp = await reply.json();
      let { error, message } = resp;
      // console.log("responce on error is: ", resp);
      throw Error(message);
    }

    const { filename } = await reply.json();
    return { error: 0, errorMsg: "", filename };
  } catch (e) {
    console.log("api.uploadFileForChange failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getUploadedCases = async ({ division }) => {
  const currentToken = get(token);
  // console.log("divisionCode is... ", division);
  let url = new URL(`${apiServer}/photoCopyMaker/getUploadedCases/${division}`);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, uploadedCases } = responseResult;
    // console.log("getHandoverCases in api is ", uploadedCases);
    return { error, errorMsg, uploadedCases };
    // console.log(UidData);
  } catch (e) {
    console.log("api.getUploadedCases failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const saveHandOverCasesToDispatch = async ({ division, handOverCase }) => {
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/photoCopyMaker/saveHandOverCasesToDispatch/${division}`
  );
  try {
    // console.log("recheckCaseId su....", handOverCase.length);
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(handOverCase),
    });

    if (reply.status != 200) {
      let resp = await reply.json();
      let { error, message } = resp;
      // console.log("responce on error is: ", resp);
      throw Error(message);
    }

    const { error, errorMsg, handOverResult } = await reply.json();
    return { error, errorMsg, handOverResult };
  } catch (e) {
    console.log("api.uploadFileForChange failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const updateDispactId = async ({ recheckCaseId, dispatchId }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/dispatch/updateDispactId`);
  let params = {
    recheckCaseId,
    dispatchId,
  };
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      let resp = await reply.json();
      let { error, message } = resp;
      // console.log("responce on error is: ", resp);
      throw Error(message);
    }

    const { error, errorMsg, result } = await reply.json();
    return { error, errorMsg, result };
  } catch (e) {
    console.log("api.updateList failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getHandOverCasesForDispatch = async ({ division }) => {
  const currentToken = get(token);
  // console.log("divisionCode is... ", division);
  let url = new URL(
    `${apiServer}/dispatch/getHandOverCasesForDispatch/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, handOverCases } = responseResult;
    // console.log("getHandoverCases in api is ", handOverCases);
    return { error, errorMsg, handOverCases };
    // console.log(UidData);
  } catch (e) {
    console.log("api.getHandOverCasesForDispatch failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const updateDispactStatus = async ({ updateList }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/dispatch/updateDispactStatus`);
  try {
    // console.log("updateList su....", updateList);
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(updateList),
    });

    if (reply.status != 200) {
      let resp = await reply.json();
      let { error, message } = resp;
      // console.log("responce on error is: ", resp);
      throw Error(message);
    }

    const { error, errorMsg, result } = await reply.json();
    return { error, errorMsg, result };
  } catch (e) {
    console.log("api.updateList failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getAcceptedCasesForDispatch = async ({ division }) => {
  const currentToken = get(token);
  // console.log("divisionCode is... ", division);
  let url = new URL(
    `${apiServer}/dispatch/getDispatcherAcceptedCases/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, handOverCases } = responseResult;
    // console.log("getAcceptedCasesForDispatch in api is ", handOverCases);
    return { error, errorMsg, handOverCases };
    // console.log(UidData);
  } catch (e) {
    console.log("api.getAcceptedCasesForDispatch failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getDispatcherHistory = async ({ division }) => {
  const currentToken = get(token);
  // console.log("divisionCode is... ", division);
  let url = new URL(`${apiServer}/dispatch/getDispatcherHistory/${division}`);
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, handOverCases } = responseResult;
    // console.log("getAcceptedCasesForDispatch in api is ", handOverCases);
    return { error, errorMsg, handOverCases };
    // console.log(UidData);
  } catch (e) {
    console.log("api.getAcceptedCasesForDispatch failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getCaseDetails = async ({ recheckCaseId, division }) => {
  const currentToken = get(token);
  // console.log("recheckCaseId is... ", recheckCaseId);
  let url = new URL(
    `${apiServer}/casePaperCreator/getCaseDetails/${recheckCaseId}/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    // console.log("Response is ", responseResult);
    const { error, errorMsg, lotDetails } = responseResult;
    return { error, errorMsg, lotDetails };
    // console.log(UidData);
  } catch (e) {
    console.log("api.getHandoverRequestsForDivision failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getAllUIDListForBatch = async ({ divisionCode, selectCard }) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", divisionCode);
  let url = new URL(
    `${apiServer}/paperPuller/getAllUIDForBatch/${divisionCode}/${selectCard}`
  );
  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, allUIDList } = responseResult;
    return { error, errorMsg, allUIDList };
  } catch (e) {
    console.log("api.getALLUIDList failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const saveChangeNoChangeStatus = async ({ lotWiseCase }) => {
  const currentToken = get(token);
  let url = new URL(`${apiServer}/paperPuller/saveChangeNoChangeStatus`);
  // console.log("url is :", url);
  let params = { lotWiseCase };
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, update } = responseResult;
    return { error, errorMsg, update };
  } catch (e) {
    console.log("api.saveChangeNoChangeStatus failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getNoChangePdfData = async ({
  selectedNoChange,
  activeCardIndex,
  division,
}) => {
  // console.log("divisionCode is ", division);
  // console.log("selectedNoChange", selectedNoChange);
  // console.log("activeIndex is", activeCardIndex);
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/paperPuller/getNoChangePdfData/${selectedNoChange}/${activeCardIndex}/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, pdfData } = responseResult;
    // console.log("pdfData is", pdfData);
    return { error, errorMsg, pdfData };
  } catch (e) {
    console.log("api.getNoChangePdfData failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const saveNoChangeLetterStatus = async ({
  selectedDate,
  division,
  activeCardIndex,
}) => {
  // console.log("divisionCode is ", division);
  // console.log("selectedNoChange", selectedDate);
  // console.log("activeIndex is", activeCardIndex);
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/paperPuller/saveNoChangeLetterStatus/${selectedDate}/${activeCardIndex}/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, noChangeCaseId } = responseResult;
    // console.log("pdfData is", noChangeCaseId);
    return { error, errorMsg, noChangeCaseId };
  } catch (e) {
    console.log("api.saveNoChangeLetterStatus failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getNoChangeDate = async ({ division, activeCardIndex }) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/getNoChangeDate/${division}/${activeCardIndex}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, dates } = responseResult;
    return { error, errorMsg, dates };
  } catch (e) {
    console.log("api.getNoChangeDates failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getCasesData = async ({ activeCardIndex, batchNumber, divisionCode }) => {
  const currentToken = get(token);
  // console.log("batchNumber is... ", batchNumber);

  // console.log("activeCardIndex is... ", activeCardIndex);
  let url = new URL(
    `${apiServer}/paperPuller/getCasesData/${activeCardIndex}/${batchNumber}/${divisionCode}`
  );
  // console.log("url is :", url);
  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const {
      error,
      errorMsg,
      pullCount,
      uidCount,
      presentCount,
      dispatchCount,
      photoCount,
    } = await responseResult;
    console.log(pullCount, presentCount, dispatchCount, photoCount);
    return {
      error,
      errorMsg,
      pullCount,
      uidCount,
      presentCount,
      dispatchCount,
      photoCount,
    };
  } catch (e) {
    console.log("api.getCasesData failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getChangeDate = async ({ division, activeCardIndex }) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/getChangeDate/${activeCardIndex}/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, changeDates } = responseResult;
    return { error, errorMsg, changeDates };
  } catch (e) {
    console.log("api.getChangeDate failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getChangeRecheckCase = async ({
  selectedDate,
  division,
  activeCardIndex,
}) => {
  // console.log("divisionCode is ", division);
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/paperPuller/getChangeRecheckCase/${selectedDate}/${activeCardIndex}/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, changeCaseDetail } = responseResult;
    return { error, errorMsg, changeCaseDetail };
  } catch (e) {
    console.log("api.getChangeRecheckCase failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getCaseData = async ({ recheckCaseId, divisionCode }) => {
  const currentToken = get(token);
  console.log("divisionCode is", divisionCode);
  let url = new URL(
    `${apiServer}/paperPuller/getCaseData/${recheckCaseId}/${divisionCode}`
  );
  console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const {
      error,
      errorMsg,
      recheckCaseId: lrecheckCaseId,
      applicationDate,
      uidList,
      subjectMarks,
      result,
    } = responseResult;
    return {
      error,
      errorMsg,
      recheckCaseId: lrecheckCaseId,
      applicationDate,
      uidList,
      subjectMarks,
      result,
    };
  } catch (e) {
    console.log("api.getCaseData failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const saveChangeLetterStatus = async ({
  recheckCaseId,
  division,
  saveData,
}) => {
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/paperPuller/saveChangeLetterStatus/${division}/${recheckCaseId}`
  );
  // console.log("url is :", url);
  let params = { saveData };
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(params),
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
  } catch (e) {
    console.log("api.saveChangeLetterStatus failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getEditMarkData = async ({ recheckCaseId }) => {
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/paperPuller/getEditMarkData/${recheckCaseId}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, editData } = responseResult;
    return { error, errorMsg, editData };
  } catch (e) {
    console.log("api.getEditMarkData failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getUpdatedChangeDates = async ({ divnCode, activeCardIndex }) => {
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/paperPuller/getUpdatedChangeDates/${divnCode}/${activeCardIndex}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, dates } = responseResult;
    return { error, errorMsg, dates };
  } catch (e) {
    console.log("api.getUpdatedChangeDates failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getChangeReportData = async ({
  divnCode,
  activeCardIndex,
  selectedDate,
}) => {
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/paperPuller/getChangeReportData/${divnCode}/${activeCardIndex}/${selectedDate}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, eChangeDetails } = responseResult;
    console.log("eChangeDetails is", eChangeDetails);
    //  let user=decryptData(eChangeDetails,key)
    //  let user1=JSON.parse(user)
    // console.log('user1 is ',user1)
    return { error, errorMsg, changeDetails: eChangeDetails };
  } catch (e) {
    console.log("api.getChangeReportData failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const getDatesCasesForDispatch = async ({
  selectedDate,
  division,
  activeCardIndex,
}) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/getDatesCasesForDispatch/${selectedDate}/${division}/${activeCardIndex}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, Detail } = responseResult;
    return { error, errorMsg, Detail };
  } catch (e) {
    console.log("api.getDatesCasesForDispatch failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getDatesForDispatch = async ({ division, activeCardIndex }) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/getDatesForDispatch/${division}/${activeCardIndex}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, Detail } = responseResult;
    return { error, errorMsg, Detail };
  } catch (e) {
    console.log("api.getDatesForDispatch failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const updateDispatchDate = async ({
  division,
  recheckApplicationId,
  dispatchDate,
}) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/updateDispatchDate/${division}/${recheckApplicationId}/${dispatchDate}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
  } catch (e) {
    console.log("api.updateDispatchDate failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getCasesForphotocopy = async ({
  selectedDate,
  division,
  activeCardIndex,
}) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/getCasesForphotocopy/${selectedDate}/${division}/${activeCardIndex}`
  );
  // console.log("url is :", url);
  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }
    const responseResult = await reply.json();

    const { error, errorMsg, Detail } = responseResult;
    return { error, errorMsg, Detail };
  } catch (e) {
    console.log("api.getCasesForphotocopy failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const genrateChangeReport = async ({
  selectedDate,
  division,
  activeCardIndex,
}) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  // console.log("selectedNoChange", selectedDate);
  // console.log("activeIndex is", activeCardIndex);
  let url = new URL(
    `${apiServer}/paperPuller/genrateChangeReport/${division}/${activeCardIndex}/${selectedDate}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, recheckCases } = responseResult;
    return { error, errorMsg, recheckCases };
  } catch (e) {
    console.log("api.genrateChangeReport failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const uploadAnswersheet = async ({ recheckCaseId, formData, uid }) => {
  const currentToken = get(token);
  // console.log("recheckCaseid is", recheckCaseId);
  let url = new URL(
    `${apiServer}/uploadFiles/uploadAnswersheet/${recheckCaseId}/${uid}`
  );
  // console.log("url is :", url);
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      body: formData,
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, uploadUrl } = responseResult;
    return { error, errorMsg, uploadUrl };
  } catch (e) {
    console.log("api.uploadAnswersheet failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getDatesForphotocopy = async ({ division }) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/getDatesForphotocopy/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, Detail } = responseResult;
    return { error, errorMsg, Detail };
  } catch (e) {
    console.log("api.getDatesForphotocopy failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const uploadFileChangeReport = async ({
  formData,
  recheckCaseId,
  divnCode,
}) => {
  const currentToken = get(token);
  let url = new URL(
    `${apiServer}/uploadFiles/uploadChangeFile/${recheckCaseId}/${divnCode}`
  );
  try {
    let reply = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
      body: formData,
    });

    if (reply.status != 200) {
      let resp = await reply.json();
      let { error, message } = resp;
      // console.log("responce on error is: ", resp);
      throw Error(message);
    }

    const { error, errorMsg, recheckCases } = await reply.json();
    // console.log('fileName is', error, errorMsg, recheckCases)
    return { error, errorMsg, recheckCases };
  } catch (e) {
    console.log("api.uploadFileChangeReport failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const getCaseuid = async ({ division, recheckCaseId }) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/getCaseuid/${recheckCaseId}/${division}`
  );
  // console.log("url/ is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, uids } = responseResult;
    return { error, errorMsg, uids };
  } catch (e) {
    console.log("api.getCaseuid failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const deleteAnswerSheetUrl = async ({ division, recheckCaseId, uid }) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/deleteAnswerSheetUrl/${recheckCaseId}/${division}/${uid}`
  );
  // console.log("urlis :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, uids } = responseResult;
    return { error, errorMsg, uids };
  } catch (e) {
    console.log("api.deleteAnswersheeturl failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const confirmationAnswersheet = async ({ division, recheckCaseId, uid }) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/confirmationAnswersheet/${recheckCaseId}/${division}/${uid}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, uids } = responseResult;
    return { error, errorMsg, uids };
  } catch (e) {
    console.log("api.confirmationAnswerssheturl failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};

const deleteChangeReport = async ({ division, recheckCaseId }) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/deleteChangeReport/${recheckCaseId}/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
  } catch (e) {
    console.log("api.deleteChangeReport failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
const confirmChangeReport = async ({ division, recheckCaseId }) => {
  const currentToken = get(token);
  // console.log("divisionCode is ", division);
  let url = new URL(
    `${apiServer}/paperPuller/confirmChangeReport/${recheckCaseId}/${division}`
  );
  // console.log("url is :", url);

  try {
    let reply = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (reply.status != 200) {
      const responseResult = await reply.json();
      throw Error(responseResult.errorMsg);
    }

    const responseResult = await reply.json();
    const { error, errorMsg, result } = responseResult;
    return { error, errorMsg, result };
  } catch (e) {
    console.log("api.confirmChangeReport failed with error :", e);
    return { error: -1, errorMsg: e };
  }
};
export let api = {
  getUserInfo,
  getAllUIDList,
  getSubjectWiseUIDList,
  getDivisionMaster,
  addBatch,
  getUIDWiseData,
  updatePaperStatus,
  saveHandOverList,
  getAllHandOverList,
  getHandoverData,
  getHandoverRequestsForDivision,
  acceptHandoverRequest,
  rejectHandoverRequest,
  getCaseLot,
  updateCaseLot,
  getCaseData,
  getCaseListForDivision,
  getLotDetails,
  saveCaseLot,
  updateLotStatus,
  getHandoverLot,
  getAcceptedLot,
  updateDecision,
  getHandoverCases,
  updateHandoverCases,
  getHandoveredCases,
  updateCaseStatus,
  getAcceptedCases,
  uploadFile,
  uploadFileForChange,
  getUploadedCases,
  saveHandOverCasesToDispatch,
  updateDispactId,
  getHandOverCasesForDispatch,
  updateDispactStatus,
  getAcceptedCasesForDispatch,
  getDispatcherHistory,
  getCaseDetails,
  getAllUIDListForBatch,
  saveChangeNoChangeStatus,
  getNoChangePdfData,
  getNoChangeDate,
  getCasesData,
  saveNoChangeLetterStatus,
  getChangeDate,
  getChangeRecheckCase,
  saveChangeLetterStatus,
  getEditMarkData,
  getUpdatedChangeDates,
  getChangeReportData,
  getDatesCasesForDispatch,
  getDatesForDispatch,
  updateDispatchDate,
  getCasesForphotocopy,
  genrateChangeReport,
  uploadAnswersheet,
  getDatesForphotocopy,
  uploadFileChangeReport,
  getCaseuid,
  confirmationAnswersheet,
  deleteAnswerSheetUrl,
  deleteChangeReport,
  confirmChangeReport,
};
