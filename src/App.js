import React, { useState, createContext, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from "react-router-dom"
import './App.css';
import { ThemeProvider } from "@mui/material";
import appThemeMui from "./theme/appThemeMui";
import ShelterList from "./pages/ShelterList";
import ShelterDetail from "./pages/ShelterCardDetail";
import AuthenticatorGrid from "./pages/auth/AuthenticatorGrid";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import { Auth } from 'aws-amplify';
import { useStore } from './pages/Hook';
import Onboard from "./pages/onboard/Onboard";
import IntroPage from './pages/onboard/IntroPage';
import SelectAccountPage from './pages/onboard/SelectAccountPage';
import RegularUserPage from './pages/onboard/RegularUserPage';
import OrgPage from './pages/onboard/OrgUser';
import CompletedPage from './pages/onboard/CompletedPage';
import { Button, Typography } from '@mui/material';
import AppContext from './AppContext';
// window.LOG_LEVEL = 'DEBUG';

//TODO: (Amanda) update the endpoint stage

const ZIPCODE_PLACEHOLDER = 98105




const App = () => {
  const [user, setUser] = useState(null);
  const [shelterData, setShelterData] = useState(undefined);
  const [userStatus, setUserStatus] = useState(null)
  const navigate = useNavigate();
  const apiStore = useStore(); 

  Auth.currentAuthenticatedUser()
      .then(userData => setUser(userData.username))
      .catch(() => console.log('Not signed in'));

  useEffect(() => {
    const getShelterData = async () => {
      try {
        const shelterDataResponse = await apiStore.loadOverview(ZIPCODE_PLACEHOLDER, ZIPCODE_PLACEHOLDER)
        console.log("Shelter data: ", shelterDataResponse)
        setShelterData(shelterDataResponse)
      } catch (err) {
        console.log(err.message)
      }
    }

    const getUserStatus = async () => {
      try {
          // const userData = await Auth.currentAuthenticatedUser();
          // console.log(userData);
          //Yichi: to call api do this 2
          const userStatusResponse = await apiStore.getUserStatus(user);
          setUserStatus(userStatusResponse.UserStatus)
      } catch (err) {
          console.log(err);
          console.log("Error in fetching user status: Not authenticated");
      }
    }

    getShelterData();
    getUserStatus();
  }, [user, userStatus, apiStore])
  
  const handleUploadData = async () => {
    const DATA_PLACEHOLDER = [{'title': 'Roots Young Adult Shelter', 'zipcode': '98105', 'street': '4541 19th Ave NE', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEC6AZZGZxR7i20WsipJcqx-mJCOftfl-lK9l_U8A0zAtzBKfd-9iGgt9NV7jONZ8CJSC2Rj7j1xiV3FC2HzWTzjVCNuwdnsAdhWEzvuei-CSwoGF5LnxwUmVurlwWUHk4ruGCBqXMlWw4EONPVQtupAdOLyqriLfaR_qCWFfOyQCdtW&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Sacred Heart Shelter', 'zipcode': '98109', 'street': '232 Warren Ave N', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uECwkjwTWaD7GKCryrqHj_27IiqPnbdVDQaWG4R0T0ZksGEPdEAUvW11BdJikKoBc0aRaOXgKFLYdkmJLy7d4P-yvBc74IXDtHT-d1Oo4MrrbGGjdawrV8viWgS37CnkIxV7Tqu31yhx8w9c8bG05Wtlh_d6cQBOm9OkKZHdbmigzmsU&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "Seattle's Union Gospel Mission: Men's Shelter", 'zipcode': '98104', 'street': '318 2nd Ave Ext S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEDXx1cLZG3T5xokB7cLt5Rp5udF5X8__c1bpaL6Iif72M-EteFfBimSuJPcY61FqlvYMkI6F94EpcyVNFLjln_kMnFRU3ZuEmoBw7LlMLdKJ7OOfo0lPVahPiBuQ5a8RsemLgf40dpfVo4nfMA9PiYKwdEDd-6W4cTAmhc0KTz8yrDJ&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Noel House', 'zipcode': '98121', 'street': '118 Bell St', 'city': 'Seattle', 'state': 'WA'}, {'title': 'St Martin De Porres Shelter', 'zipcode': '98134', 'street': '1561 Alaskan Way S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEBkBpY7FLSVyhvskzDQeUPqJN9Ycyoxx_HbcUfxeEehcoh8GDAM11JesmeGXO5Pja8MdqG6D1UkKWxSrycpJnxh1cXbJFRg_PRlY0volH9IfJu4XQ-GwJn3VE7MNEGBt-zwtDyCtwxTYnZnhbYziqnL_9ABVZ5obaGv6vg2Oobmuuoy&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "Mary's Place", 'zipcode': '98101', 'street': '1830 9th Ave', 'city': 'Seattle', 'state': 'WA'}, {'title': 'The Inn Enhanced Shelter - CCSWW Program', 'zipcode': '98109', 'street': '1911 Aurora Ave N', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEA8wTAJEN1WxD8QgFIfNuT2Y6attZdQKN9kgSSNaK-OkfOnkcN0Zi3E7lYPrORB8R5_l1d_znMRmRMPRjGEpvOfAM8GHh1Vs5w7_j_cS9wELf1OvCr8628fk0V_VHn1qAvvV_UkavZ_j9jqrj0svrmL8QOwnZ5NqcYCb6W6twx8QQi1&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Compass Blaine Center Emergency Shelter', 'zipcode': '98109', 'street': '150 Denny Way', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEC-NQzBTI7nQtB2G22SgQwX2JXJ0Oghf-TX8JQNtVnb5_3TLV2SAipdrmV2G0Nt4y4vXNl3UmN6FwDZaWJYBwBlKaCFX1roifwz70Yv91_COkctdVKJQENZgcY-IRLsB9qZDpNLPru8o5OHsdZyzO8517QdjRt5JRbKrAtrM97i7Mlt&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "Seattle's Union Gospel Mission: Hope Place, Women and Children's Shelter", 'zipcode': '98118', 'street': '3802 S Othello St', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEClT7139RKtv_hyRZ4YIAjuFsDF_27Kjrmn1_qTSbZR5C-szZpwoxQae03McIxXoesXZghJx5y1vGIXs5C59p4T43jS73n68MKIOSHn6b95cJxxrjx1wiadRM4K1MkEEZQ14aGeC3LaXOrQ0KfZGahaAjmyHe98AvnRXt0Ym_Dkp5so&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Compass Housing Alliance', 'zipcode': '98104', 'street': '77 S Washington St', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEAj6kRZF9fKHl521MpKllfjXFcn3MsJrpp4owGR9u_yUC8LOFjdspUoEFmT5V8jbk5mro9BVP3I43NVScCsF5xwXCScAyPE4T8YB8yUYPzBIKo49Nvqhh6FLQZdpTs6foqEUtzzQBKeeqMDFhj-o3Jgwivng1jqwk00kZQY3oyVdkNJ&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Marys Place De', 'zipcode': '98109', 'street': '712 Aurora Ave N', 'city': 'Seattle', 'state': 'WA'}, {'title': 'Salvation Army William Booth Center', 'zipcode': '98134', 'street': '811 Maynard Ave S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEDE3Btdg35O3hwDZjv_SEuzsfX85eWtbcbBSDn22lvjp8zcexy7Rc16SV3skzvAyH0OcgyT9V4p9_tRHHTWnYHrbzXRo7pEUQW_rMmOmjjoDQS-r5oLXjxzbqo1O4tGUbxBg06X64b1Cdr9piuJPDDGwjoAidB1ggb_pa-Sz02wWl2J&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'The bridge shelter', 'zipcode': '98101', 'street': '1923 3rd Ave', 'city': 'Seattle', 'state': 'WA'}, {'title': "Mary's Place Women's Day Center", 'zipcode': '98101', 'street': '1830 9th Ave', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uECxaT7NwMfyga4Xewjq40TbRPtTT-yZBOODvwasj5vqB7M73nmb2hx7ur1wWnsiKAnV9vpWAUL6PZJIBiH_68jkLplispAWHzfzkN7Dh4WazqNO8d2u0dBHe_PipL3AuPBN9Gg5ehmKnbpuzmHDqB9vJCDU04V0WwyP_zDTMCX__cIB&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "Jubilee Women's Center", 'zipcode': '98112', 'street': '620 18th Ave E', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEDGQujR6MMwrvs-0q50xivpDHk_Fqs5hq_TQVOyPvXsRvVP_DSLDDgOvmHG-HiDHxPqNRebtPVqiAsB1R9hcYFhqYMeku_IiZvrFG7KWjN3cszjqPM_LbqzUmCLUg0rBOz-4q9bzAOD1SCyhyMEKC62nVuca8L8JaSWNYirT2DyrjiR&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Salvation Army - Food Bank', 'zipcode': '98101', 'street': '1101 Pike St', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uED9dZbnW8kvgNNl7D-p06ktLmVdKm4MyA4j3_qqTsSjjlVfUkbX76xaPyPe_P7uBZvQJcNrcZFM8cpZ_kzifB7al8tdgJgljdgePz2se9Uyy5aUQoLMZIz99yYsR4sBOoZy822dejS6Eo4f2jIU3hZsRO5y258ZZuYjie41OzL1qkgB&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Bread of Life Mission', 'zipcode': '98104', 'street': '97 South Main St', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uECv64xRiKmLnGWZFHNlPh0Vfkpv8oacdpsYPqSCDFOCIhLegE7TkePSdLEcDBVrjMQkx6u2lG3vIgLIDianDJAPdaXNb1soLFzVPheCoTNHD_M9d7TZKkqSdd17pe6DrMMEmKdVUGFHdrrAtqPHctwCP2DwbcbahCKCLwkgsgHcisB2&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "DESC's Auxiliary Shelter", 'zipcode': '98104', 'street': '505 3rd Ave', 'city': 'Seattle', 'state': 'WA'}, {'title': 'Harborview Hall', 'zipcode': '98104', 'street': '326 9th Ave', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEASvWGq5S5Rb-11gkfurTHSisFOi5Dggwv-NX5gmLg9gwdmasym9sw4QUWThsYTBIQGXz6hPCvfRmAiPLOSigCzdOpj4JaJe3lEVoAaq5N2BmLSPfWiTrPt9Hz2zm4Py-5Xk1KqZjd0EzQrbHq-jBgzXq0iwPnMcQn8huY8cbXKU69K&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Junction Point', 'zipcode': '98119', 'street': '551 Elliott Ave W', 'city': 'Seattle', 'state': 'WA'}, {'title': 'Operation Nightwatch', 'zipcode': '98144', 'street': '302 14th Ave S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEAmujaoysLQyndGJjJ7JYBmYcRFI-TZDbkNHIai6ibYgLgd1qXDqx5HBXs72Q7T7KUWfFJ7YcgeGUjU_KMwq8PmBQAO9i-HpQPpOJMy9KYXYWQylzDjMCdwcelPuB-nSYQa2uVQpgoV1Vd1z451h76HyYv1r26lJYye89CdPQ317ZbR&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Jungle 3.0', 'zipcode': '98144', 'street': 'Mountains to Sound Greenway Trail', 'city': 'Seattle', 'state': 'WA'}, {'title': "Mary's Place Administrative Offices", 'zipcode': '98109', 'street': '113 Dexter Ave N', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEDkcucT-kxF_M2FRXku5BdaWRtzMEABT_99eXwmBJKfKFrGs6q6XeTk6M_oJ1U19KmS3xhUPX8F7LmKTBDqDg-bdw3A0yqwwaZ6EmJkqaje0kd1tcQGY1dcoQU0IuJFcaKj1IYKUht3UiC8uab6yoV7hHvie0PrmlGVsKj7IKpwG6XT&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Solid Ground', 'zipcode': '98103', 'street': '1501 N 45th St', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEAJIKDIW1VSlaBBPt_MMcHZH5Aus3LXZJ3diwuq_9r3FBEcBm8W6gXaE4IB0YpDthjKL-fA18hlI_Cpeh14h5bChDhqxigim86Xm679LnZ3q6CTcXZpeVhEniTKhCI88wYUO6AAgeayxnBtWt-5Ysts1b6dssKwxdbOx307_Ie4syC0&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'LIHI Whittier Heights Tiny House Village', 'zipcode': '98117', 'street': '8030 15th Ave W', 'city': 'Seattle', 'state': 'WA'}, {'title': 'True Hope Village', 'zipcode': '98122', 'street': '1714 E Yesler Way', 'city': 'Seattle', 'state': 'WA'}, {'title': 'Nickelsville Northlake Tiny House Village', 'zipcode': '98105', 'street': '3814 4th Ave NE', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEAsel8j8ZfJadD22o02liRFkEp5O8pzIVQJXuk3S6iXP5EyoyTsHVoQFQ2tEZIUtehuslP8IrZV3dTL2SPGikAzWcf5ECLqcgywWbEphK2BBKUsN0ZBWbaDwj3Q1uqMRnN7a74NAlL1R-eI6oYoI7jUP_0yOgmFpEfvVPzRt9uAoVWB&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'The Inn Enhanced Shelter - Referral only through CEA', 'zipcode': '98109', 'street': '1911 Aurora Ave N', 'city': 'Seattle', 'state': 'WA'}, {'title': 'Lazarus Center', 'zipcode': '98144', 'street': '2329 Rainier Ave S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uECSTJVwl5HxNT8Z4jJJ5TbcFNTBRHQmvx-QmH-y5xWiwhheGUnj3f4d89SDap93jDhG9McNOcb02YWYvdFVkDZu1WthGMNpknfsjcjWLBh-muSRHGvRPtMh48piPqADxOMylj4Za_aYXrgKgHQJy-ZvTrXhJxAGinIIpKr9u-ZmPFiX&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Facing Homelessness', 'zipcode': '98105', 'street': '4001 9th Ave NE', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEDlV1hZgorCWpt9A_lRSeEpRH0k7K3hybF2oZzOEm-DBcoP1lNHFmd8jnmhtskhObkOAp7aP6hBZ74jS8e3ZQ5sFpuwWKHvZiOiQKxb2hlGnbezKsva-GJfdj6r6oJcbJxGjhr0qEJgwo5LqgyXaJvw44CLXCKly--oHFe5I_dtsCvE&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "DESC's Queen Anne Shelter", 'zipcode': '98109', 'street': '157 Roy St', 'city': 'Seattle', 'state': 'WA'}, {'title': 'Rose of Lima House', 'zipcode': '98121', 'street': '118 Bell St', 'city': 'Seattle', 'state': 'WA'}, {'title': 'Elizabeth Gregory Home', 'zipcode': '98105', 'street': '1604 NE 50th St b6', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEBTIL0Nw-Faol9G9C460SNsCIeFkp_k8HqldFoiHG3mXQx4ERNEC6wrbxAs6BfCmlnqW-3lWtk4j3aHzYx6a9mdJJuyeRoSIP_hwCPAh1590pljtwu82bI3TrTbMFJlnm1hhswnQD7tuqwSEV9Y1MWqzishMjNz9gnW59Zl_sERGwyG&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "YouthCare's Orion Center", 'zipcode': '98101', 'street': '1828 Yale Ave', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEAtKu8WieKLqjhWcRAx-WrGbnGZofIYzvnNz9qsBTDcZJpxiuZUcezcKX-y8CY6BbZqe6ije5A4oZhxAL46CXsMsfUTMKKEGXJ6OmnEM6kixGsQFKefAMdo7YWyWtD-pxTiNzdkKu2mHwUoll-YQr-9yXD9toaVkkKZg-VPj5PpHqbg&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Tent City 3', 'zipcode': '98178', 'street': '12914 Martin Luther King Jr Way S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEB6CLUgcbkmSG3IQpfEzmbim-XCG8_OYv2NhpoCjX7pFjYf8vfw8QdKbz_PckaU4WJf37LY2ZDlayH1L_fr9rAR6tvpVzslgMdVy0WzTMxCn_BpaRvung5DmiYPiYeXwcmebFedLqNFkMLbNya2qpwezVUYaLnu5MvjxKCPcXGc0Av5&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "Peter's Place", 'zipcode': '98144', 'street': '901 Rainier Ave S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEAhGPwJTw8DKSrkO61zlSOPgywhMC4EmLtzk-r52txIesB99gIw_1qA675OyfVuEzYyOoFX7z7W6ru3hobAqvphABJXPL_8Ld_RgHGj-MltQduK9qzkJhZRibff5zEbe6U06_z95hwR1meqQ2CutNVjDrbZxIBTIV2tkSDdfIyGz5-X&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': '2 CHEEZEE HOMELESS OUTREACH', 'zipcode': '98122', 'street': '1501 33rd Ave', 'city': 'Seattle', 'state': 'WA'}, {'title': 'YouthCare', 'zipcode': '98105', 'street': '2500 NE 54th St', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEBWK-d2DOQsLpaFcvzafbN1GfqC6U1gKCV0KZMqlPp8aPn8cEJT7QYcJY4xWGOHZiDVV5erTquPaC20kH0lm4gdS5NJkArMhXN9y5qziVZozKWOUTtNF0VGE96ErawbdHcGEN6CeQ4RCfyg8TkVulo69DhGfL5yYf3wtRGmUQgjSpRU&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Seattle Animal Shelter', 'zipcode': '98119', 'street': '2061 15th Ave W', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uECRKBGr2NIOfOhf2wPXMSBeKvYgHD937er6qsxM8Ca704xlJJfqDCCRTtHkS1IX8eHDWpb0WviNcZdiV5pIKMQDDLV7kzuTKMiWvslqh0ys9QccYC-9uZ077UotPZs_W9czH5XgryC6nMp6isHOQ5NNFyOClCkBrUTfkZiQeaKGjFzF&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'LIHI Othello Village', 'zipcode': '98118', 'street': '7544 Martin Luther King Jr Way S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEDp3nsYVIzGSgvuRd7ijof9HfLT7czw_WHG09eWo0s3SeMqum6ntJfLh1UrN2QBNCtUad7b-GmrBGQCJ3TSLAI7eJ5y66W5ahrUCjeG4uYO4-79UJe4plfc4cuCZ4Xwjqsf8ozxJYLosxG--xA9JwyMmAZGro5fpEYBf4xQ9hefm_M&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "Angeline's Day Center", 'zipcode': '98121', 'street': '2030 3rd Ave', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEAeMjZx7YmAeUNhijOdZvQIn2j1mlicFQ1dd7Tn17QXcFoOEK-WF0kOpafmQGpaahdB9qUVT1KykbSgvMyghPs99TREY7o7XmXnkh6a2aztzfh0u8Agqf1FP5kGzWNpQI1u-nL1oKSzEHH3yIr08fuGUZoshIh3t6pHvyqILNScPJwJ&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'YWCA Seattle | King | Snohomish', 'zipcode': '98101', 'street': '1118 5th Ave', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEBja8vpHhnM8f0MfVgSP8o1BjTBzNhhXNXj81PK5Kyh9c3VvJA3wtKxA4OGKSrHG_uO3PZfbI65UsXwDIbaIKllIiDNBV7dQ-h6tzQrVbYKfKP6IgMwT75_To0pD77yt3pJb9KXixsVFGztYUvAnMCgKlt_oMsz2n2M9aXiEC8DoDaQ&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'New Horizons Ministries', 'zipcode': '98121', 'street': '2709 3rd Ave', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEDMLpeNV1Sjp1HS3FUz5Au8VNmEwdwf6CuOs4luk7UGNvHGG4wvfFz5ce14o0-K2XI04yKOo2HaYuvdpshL8BuaMIzmxCoYiSHDVyoSZCU-Co0_GDwLY9ODOiE1PT82yXp0OIOCGCH7cFQgfaca80bHVsZY-JFLTBdDBvzuFCdeWqTj&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "DESC's Rainier House", 'zipcode': '98118', 'street': '5270 Rainier Ave S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uECV4iEf58CTfe66cKMMG-cQrwGM77iokXxWSZTt7GWxilUxw5TlJKCHYmeLulOhsa4F2k3VF7uK_vurVnyYThmAW3v8PXZgEXkbsgt1FLrBVKDzeSqsH4Os_zm3V_Jk1Q-zi939hIjnf9eYn8F7cmRVbrZRF6j0tTjEth1osqkdyskV&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "DESC's Navigation Center", 'zipcode': '98144', 'street': '606 12th Ave S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEAZT_nW8jueYPYjbzR-cgoIgFlkKgBJXpcZ6xYa-QVddgXwkKIumUJxgb6B6nZElWiS7dQ56YYb1AwURLvqFcZVkZKiwPVURdwN_1h92VXWSDv-gwhTQNIK75W-yNggtKCo2JSDY5FnarzeA2Pi6A6riIufUJKiYmvZVWE5gznGqVlk&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': "DESC's Aurora House", 'zipcode': '98133', 'street': '10507 Aurora Ave N', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEBNbM9b_d11Jyygvjx00qW2sk1wwollA678-DnkgUODriTbrTAOJYs0Pka6IIuMrVdQajNfg0lWJa8d23naEG3tZkC0rXmUmmnjGBOtOQ7ireeyu_lvIZEDg6FAwecWOHGmbxzMOBvYRvgdoD0VCohUw_ZswoB_wY3HxcGI2auAsw2X&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Seattle/King County Coalition on Homelessness', 'zipcode': '98104', 'street': '85 S Washington St Suite 310', 'city': 'Seattle', 'state': 'WA'}, {'title': 'St Francis House', 'zipcode': '98122', 'street': '1108 E. Spruce St *No mail is accepted at this address', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uECr5B-97Yyk81GB8KiWKXylczuB9nT5L_0LOq_vN_LzHBbOhNuN_exBnHi_j-z3UxSKZUXuhmuMm8O9OA9p5q8Lr13aXJwsDCRXY6nNiFsVf8JDbP2X6pbNzKUUgSkufb9iTVZTHmCU9lGkMhymoPFl1HtinMaukDont4WMct1umkbT&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'YWCA - The Willows', 'zipcode': '98118', 'street': '3800 S Myrtle St', 'city': 'Seattle', 'state': 'WA'}, {'title': "DESC's Main Administrative Offices", 'zipcode': '98104', 'street': '515 3rd Ave', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uED7EE9ebTS9CI-1xHOD2_jR4wafNkHQOG8BjxjsXKZyq19dKymQS10h1FlpQu5V1A_Ee7lCp16zEXbz-6Cyvk0AphvNDs2hzwBnVplSU8OwqtAf_0eR0566hj7cz5U9PUe4IkstyQ-vw9OaYycRBEajjtGC74XQOqw_BDy5e4PPC_F9&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Seattle Indian Center', 'zipcode': '98144', 'street': '1265 South Main St #105', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEC2tiltd82CiOVBQc2S0mxenBE4WQIUlvpRblMxLMN2F1_9j6roryuU5UVvpujHySZ4-r9eY3STAKwfA7wUFb1g3IAWNy8M3Yj9Lx4cpC1QV0UY8TPhZmahgPvypCAnSo8UxgkvyO3a8XdcjH_9M-fSLjKJVCZRCssb9vsNdqCLEvuC&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'YWCA Phillis Wheatley Branch', 'zipcode': '98122', 'street': '2820 E Cherry St', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEA0c5MfaUphaigxe60O0DMunvHXtF7w7P_s1mve7g58nw_vYElL0tb9SNfOEZNDiEq3XBL90I4qVr7zLNfJABL62BbPHegUcmYdloJLSpHdTE3R6iZ-4SnQRe3GkAs5qJ9XzvkuUg97Z384nGDXpbDWo7L1h2RJ0SfQ9GUUYnyDDO4w&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'All Home', 'zipcode': '98104', 'street': '201 S Jackson St 2nd floor', 'city': 'Seattle', 'state': 'WA'}, {'title': 'YWCA Opportunity Place', 'zipcode': '98121', 'street': '2024 3rd Ave', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEBVrCd94XH_UkJ1UqCbZJPCjNy4kO2ITxHF40AyMjFdtW8DsNc3wB7FN6WkYI8UaixVF-I11fqdQIwnLUcc1l_LfMdw692OSQtZCLzgQZPJMWbMCne7muAoctdCF0xiaHbUi9bsSvwTV1lq6L7pKF48GhP4t44SjpPzS9AIKwldxF3N&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Salvation Army Jefferson Day Center', 'zipcode': '98104', 'street': '420 4th Ave', 'city': 'Seattle', 'state': 'WA'}, {'title': 'Urban Hands', 'zipcode': '98103', 'street': '8420 Greenwood Ave N', 'city': 'Seattle', 'state': 'WA'}, {'title': 'Womens Wellness Center', 'zipcode': '98101', 'street': '1900 2nd Ave', 'city': 'Seattle', 'state': 'WA'}, {'title': 'Shelter Lounge', 'zipcode': '98115', 'street': '7110 East Green Lake Dr N', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uECfibYKR7ebPNkGjwVaf0D3f-Q05rYtO-DZLxvQTsfun-iAd7SPOY6_yIiOzSdPxKxopIVFAKpdjPE-XlbLEGr2fojp3PBZ-4aI_WIuFltSY0YDHGuzmsn480f_d73jnD9ueDC12kfTVDPXZi9qFkwEocSOjn5W0bFFwTJltyjAhJMp&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'Chief Seattle Club Inc', 'zipcode': '98104', 'street': '410 2nd Ave Ext S', 'city': 'Seattle', 'state': 'WA', 'profile_pic_path': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=Aap_uEDOnoDGq-pN8hzwlJamTRma9QMlZFHZBG2-p844qzl3p7-OcDxShvJ2QmutV225GAB9zQfzZLwQ13eUS4eSFXs_F0lWwjScBrmKYlANG9Lz5ecvS0CJsfl-k5xohOok-dFVPtPmkZLT2dhleELL-IHXptQeiFhHpwsmyfJnWTERQRzN&key=AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw'}, {'title': 'The BLOCK Project', 'zipcode': '98105', 'street': '4001 9th Ave NE', 'city': 'Seattle', 'state': 'WA'}];
    for (let i = 0; i < DATA_PLACEHOLDER.length; i++) {
      const result = await apiStore.upsertPostWithURL(DATA_PLACEHOLDER[i]);
      console.log(result);
    }
  }
  //TODO: (Yichi) 
  //the following line 101 - 109 is a code to upload individual img to s3 bucket
  //you will need to modify react code to take the input to take mutiple images and call api on each image
  return (
    <AppContext.Provider value={{
        user: user,
        setUser: setUser,
        userStatus: userStatus,
        setUserStatus: setUserStatus
    }}>
      <Button onClick={() => {
        handleUploadData()
      }}>Upload</Button>
      <ThemeProvider theme={appThemeMui}>
        <Routes>

          <Route index path="/app/dashboard" element={
            <ShelterList user={user} setUser={setUser} shelterData={shelterData} setShelterData={setShelterData}/>
          } />

          <Route path="/app/auth" element={<AuthenticatorGrid/>}>
            <Route path="sign-up" element={
              <SignUp setUser={setUser}/>
            } />
            <Route path="sign-in" element={
              <SignIn/>
            } />    
          </Route>

          <Route exact path="/app/onboard" element={<Onboard/>}>
            <Route path="intro" element={
              <IntroPage/>
            } />
            <Route path="select-account-type" element={
              <SelectAccountPage/>
            } />
            <Route path="reg-user" element={
              <RegularUserPage/>
            } />
            <Route path="org-user" element={
              <OrgPage/>
            } />
            <Route path="completed" element={
              <CompletedPage/>
            } />
          </Route>

          <Route path="app/shelter-detail/:id" element={
            <ShelterDetail shelterData={shelterData}/>
          } />

          <Route path="*" element={
            <Navigate to="/app/dashboard"/>
          } />
        </Routes>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;