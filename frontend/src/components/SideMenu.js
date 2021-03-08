// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import styled from 'styled-components';

// import TreeView from '@material-ui/lab/TreeView';
// import TreeItem from '@material-ui/lab/TreeItem';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faChevronRight,
//   faChevronDown,
//   faImage,
// } from '@fortawesome/free-solid-svg-icons';

// // style
// import '../styles/SideMenu.css';

// import Header from '../pages/Header';

// // newTree = TreeItem.update(item, 변경점)
// // setState(newTree)

// // function SideMenu() {
// //   /*
// //     path = {
// //         id: int,
// //         active: null,
// //         collapsed: boolean,
// //         path: sty,
// //         size: int,
// //         isDir: boolean,
// //         subPath: path[],
// //     }
// //     state = path[]
// //   */
// //   const [state, setState] = useState([]);
// //   console.log('RESULT', state);
// //   // API 요청
// //   useEffect(() => {
// //     const getData = async () => {
// //       const api = `http://localhost:8000/api/browse/`;
// //       const result = await axios.get(api);

// //       setState(
// //         result.data.map((infos, index) => ({
// //           id: index,
// //           active: null,
// //           collapsed: false,
// //           path: infos.path,
// //           size: infos.size,
// //           isDir: infos.isDir,
// //         })),
// //       );
// //     };
// //     getData();
// //   }, []);

// //   // 1. file과 dir의 컴포넌트를 분리한다, file -> viewer로 넘어가야한다. dir -> api 요청으로
// //   // 2. depth가 깊은 path의 정보가 바뀌었을 때
// //   // 3. clicked state는 없앤다
// //   // 4.

// //   const renderTree = (state) => {
// //     <TreeItem key={} ></TreeItem>
// //   }

// //   return (
// //     <div>
// //       <div className="tree">
// //         <Toolbar>
// //           <FloatLeft>
// //             <span>Image List</span>
// //           </FloatLeft>
// //         </Toolbar>

// //         <TreeView
// //           defaultCollapseIcon={<ExpandMoreIcon />}
// //           defaultExpandIcon={<ChevronRightIcon />}
// //         >
// //           {renderTree(state)}
// //         </TreeView>
// //       </div>
// //     </div>
// //   );
// // }

// // const Toolbar = styled.div`
// //   position: relative;
// //   display: flex;
// //   color: #d8e0f0;
// //   z-index: +1;
// //   border: 1px solid red;
// //   padding-bottom: 4px;
// //   i {
// //     margin-right: 5px;
// //     cursor: pointer;
// //   }
// //   i :hover {
// //     color: #d8e0f0;
// //   }
// // `;

// // const FloatLeft = styled.span`
// //   padding-left: 4px;
// //   width: 100%;
// // `;

// // export default SideMenu;

// const initialState = [
//   {
//     path: '/a',
//     name: 'a',
//     isDir: true,
//     open: false,
//     subPath: [
//       {
//         path: '/a/first',
//         name: 'first',
//         isDir: false,
//       },
//       {
//         path: '/a/second',
//         name: 'second',
//         isDir: true,
//         open: false,
//         subPath: [
//           {
//             path: 'a/second/alpha',
//             name: 'alpha',
//             isDir: false,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     path: '/b',
//     name: 'b',
//     isDir: false,
//   },
// ];

// const SideBar = () => {
//   const [state, setState] = useState(initialState);

//   const onClick = (path) => {
//     path.open = !path.open;
//     setState([...state]);
//   };

//   return (
//     <>
//       <Header />
//       <div id="sidebar">
//         <div className="container">
//           <ul>
//             {state.map((item) => {
//               return item.isDir ? (
//                 <Directory path={item} onClick={onClick} />
//               ) : (
//                 <File path={item} />
//               );
//             })}
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// const Directory = ({ path, onClick }) => {
//   return (
//     <div className="content">
//       <div className="directory" onClick={() => onClick(path)}>
//         <FontAwesomeIcon
//           className="icon"
//           icon={path.open ? faChevronDown : faChevronRight}
//         />

//         <li>{path.name}</li>
//       </div>
//       {path.open && (
//         <ul className="second">
//           {path.subPath.map((item) => {
//             return item.isDir ? (
//               <Directory path={item} onClick={onClick} />
//             ) : (
//               <File path={item} />
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// };

// const File = ({ path }) => {
//   return (
//     <div className="file">
//       <FontAwesomeIcon className="icon" icon={faImage} />
//       <li>F {path.name}</li>
//     </div>
//   );
// };

// export default SideBar;
