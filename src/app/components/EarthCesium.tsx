"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Viewer, Math, Cartesian3, Color, IonWorldImageryStyle, createWorldImageryAsync, CustomDataSource, ScreenSpaceEventHandler, defined,  ScreenSpaceEventType, Ellipsoid, Entity, JulianDate,  ConstantProperty, HeightReference, DirectionalLight, NearFarScalar, } from 'cesium';
import { useRouter, useSearchParams } from 'next/navigation';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { dataState, DataType, filterState, mailAlarmState, PostAlertInfo, selectedDisasterIdState, userLoginState } from '../recoil/dataRecoil';
import axios from 'axios';
import Cookies from 'js-cookie';
import AlertModule from './socket/AlertModule';
import ChatToggleComponent from './socket/ChatToggle';

//////// interface ////////
interface disasterInfoHover {
  dId: string;
  dType: string;
  dCountry: string;
  dStatus: string;
  dDate: string;
}

interface alartInfoHover {
  alertCountryName: string;
  alertRadius: number;
  alertlevelRed: boolean;
  alertlevelOrange: boolean;
  alertlevelGreen: boolean;
  createAt: string;
}

interface AnimationState {
  stop: () => void;
  entity: Entity;
  originalSize: number;
}

const EarthCesium = () => {
  const cesiumContainer = useRef(null);
  const router = useRouter();
  const search = useSearchParams();
  const viewerRef = useRef<Viewer | null>(null);
  const dataFilter = useRecoilValue(filterState);
  const [isUserInput, setIsUserInput] = useState(true);
  const [data, setData] = useRecoilState(dataState);
  const [dIdValue, setDIdValue] = useState<string>('');
  const [custom, setCustom] = useState<CustomDataSource | null>(null);
  const [clickedEntity, setClickedEntity] = useState(null);
  const [activeAnimation, setActiveAnimation] = useState<AnimationState | null>(null);
  const [showAlertTab, setShowAlertTab] = useState<boolean>(false);
  const [mailAlarmInfo,setMailAlarmInfo] = useRecoilState(mailAlarmState);
  const [alertData, setAlertData] = useState<PostAlertInfo[]>([]);
  const isLogin= useRecoilValue(userLoginState);
  const setSelectedDisasterId = useSetRecoilState(selectedDisasterIdState);
  

  function getColorForDisasterType(type: any) {
    switch (type) {
      case "Tropical Cyclone":
        return "RED";
      case 'Mud Slide':
        return "BROWN";
      case 'Flash Flood':
        return "DARKBLUE";
      case 'Wild Fire':
        return "ORANGE";
      case 'Cold Wave':
        return "CYAN";
      case 'Technological Disaster':
        return "GRAY";
      case 'Snow Avalanche':
        return "LIGHTSKYBLUE";
      case 'Volcano':
        return "DARKRED";
      case 'Fire' && 'Forest Fire':
        return "FIREBRICK";
      case 'Epidemic':
        return "GREENYELLOW";
      case 'Storm Surge':
        return "STEELBLUE";
      case 'Tsunami':
        return "DEEPSKYBLUE";
      case 'Insect Infestation':
        return "OLIVE";
      case 'Drought':
        return "TAN";
      case 'Earthquake':
        return "SIENNA";
      case 'Flood':
        return "NAVY";
      case 'Land Slide':
        return "SADDLEBROWN";
      case 'Severe Local Storm':
        return "DARKSLATEGRAY";
      case 'Extratropical Cyclone':
        return "DARKORCHID";
      case 'Heat Wave':
        return "RED2";
      default:
        return "WHITE";
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && cesiumContainer.current) {
      let viewer = new Viewer(cesiumContainer.current, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        homeButton: true,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        creditContainer: document.createElement("none"),
      });

      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 0;
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 30000000;
      viewer.scene.screenSpaceCameraController.enableTilt = false;
      viewer.scene.screenSpaceCameraController.enableLook = false;
      viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      viewer.scene.globe.enableLighting = false;
      viewer.scene.light = new DirectionalLight({
        direction: Cartesian3.fromDegrees(1.0, 1.0, 1.0),
        intensity: 11,
      });

      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(127.7703,35.4634, 10000000),
        orientation: {
          heading: Math.toRadians(20),
          pitch: Math.toRadians(-40),
          roll: 0
        }
      });

      viewerRef.current = viewer;

      createWorldImageryAsync({
        style: IonWorldImageryStyle.AERIAL_WITH_LABELS,
      }).then((imageryProvider:any) => {
        viewer.scene.imageryLayers.addImageryProvider(imageryProvider);
        console.log(`Log: Layout loaded successfully.`)
      }).catch((err:Error) => {
        console.log(`Log: Failed to load layout: ${err}`);
      });

      return () => {
        if (viewer && viewer.destroy) {
          viewer?.destroy();
        }
      }
    }
  }, []);

  const loadData = async () => {
    try {
      const [oldData, newData] = await Promise.all([
        axios.get('https://worldisaster.com/api/oldDisasters'),
        axios.get('https://worldisaster.com/api/newDisasters'),
      ]);
      setData(oldData.data.concat(newData.data));
      setCustom(new CustomDataSource('Disasters'));
      console.log(`Log: Data load successful.`);
    } catch (err) {
      console.log('Log: Data load failed.', err);
    }
  }

  const token = Cookies.get('access-token');

  const alartLoadData = async () => {
    if(!isLogin) return;
    try {
      const response = await axios('https://worldisaster.com/api/emailAlerts/',
      {
        headers: {Authorization: `Bearer ${token}`}
      });
      console.log('Log: Alert data load successful.', response.data[0].alertLatitude);
      setAlertData(response.data);
    } catch (err) {
      console.log('Log: Alert data load failed.', err);
    }
  }

  const applyFilters = () => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.scene || !viewer.camera) {
      return;
    }
    if (!custom) return;
    viewer.dataSources.add(custom);
    let filteredData = data

    if (dataFilter.selectedCountry !== "world") {
      filteredData = filteredData.filter((item: DataType) => item.dCountry === dataFilter.selectedCountry);
    }
    if (dataFilter.selectedDisaster && dataFilter.selectedDisaster.length > 0) {
      filteredData = filteredData.filter((item: DataType) => !dataFilter.selectedDisaster.includes(item.dType));
    }
    if (dataFilter.selectedYear) {
      filteredData = filteredData.filter((item: DataType) => new Date(item.dDate).getFullYear() === dataFilter.selectedYear);
    }
    if (dataFilter.selectedLive !== null) {
      filteredData = filteredData.filter((item: DataType) => (dataFilter.selectedLive ? item.dStatus !== "past" : item.dStatus === "past"));
    }

    custom.entities.removeAll();

    
    if (alertData){
    alertData.forEach((item:PostAlertInfo) => {
      if (item.alertLongitude && item.alertLatitude) {
        const alertPointEntity = new Entity({
          position: Cartesian3.fromDegrees(Number(item.alertLongitude), Number(item.alertLatitude),),
          point: {
              pixelSize: 10,
              color: Color.RED,
              outlineColor: Color.WHITE,
              outlineWidth: 2
            },
          properties: {...item, type:'alert'}
        });
        const alertEllipseEntity = new Entity({
          position: Cartesian3.fromDegrees(Number(item.alertLongitude), Number(item.alertLatitude),),
        ellipse: {
          semiMinorAxis : item.alertRadius*1000,
          semiMajorAxis : item.alertRadius*1000,
          height: 0,
          material: Color.RED.withAlpha(0.2),
          outline : true,
          outlineColor : new Color(255, 0, 0, 127),
        },
      });
        custom.entities.add(alertPointEntity)
        custom.entities.add(alertEllipseEntity)
      }
    });
  }

    filteredData.forEach((item: DataType) => {
      if (item.dLongitude && item.dLatitude) {
        let entityToAdd;
        if (item.dStatus === 'ongoing' || item.dStatus === 'real-time') {
          item.dStatus === 'ongoing' ? (
            entityToAdd = new Entity({
              position: Cartesian3.fromDegrees(Number(item.dLongitude), Number(item.dLatitude),0),
              point: {
                pixelSize: 10,
                heightReference: 0,
                color: Color.fromCssColorString(getColorForDisasterType(item.dType)),
                scaleByDistance: new NearFarScalar(10e3, 5, 10e6, 1)
              },
              properties: {...item, type:'disaster'}
            })) : (
            entityToAdd = new Entity({
              position: Cartesian3.fromDegrees(Number(item.dLongitude), Number(item.dLatitude)),
              model: {
                uri: `/pin/${getColorForDisasterType(item.dType)}.glb`,
                minimumPixelSize: 100,
                maximumScale: 80000,
                heightReference: HeightReference.CLAMP_TO_GROUND,
              },
              properties: {...item, type:'disaster'}
            }))
        } else {
          entityToAdd = new Entity({
            position: Cartesian3.fromDegrees(Number(item.dLongitude), Number(item.dLatitude)),
            point: {
              pixelSize: 10,
              heightReference: 0,
              color: Color.fromCssColorString(getColorForDisasterType(item.dType)),
              scaleByDistance: new NearFarScalar(10e3, 5, 10e6, 1)
            },
            properties: {...item, type:'disaster'}
          });
        }
        custom.entities.add(entityToAdd)
      }
    });
  }

  useEffect(() => {
    loadData();
    alartLoadData();
  }, []);

  useEffect(() => {
    if (!custom || !viewerRef.current) return;
    viewerRef.current.dataSources.remove(custom);
  }, [dataFilter])

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.scene || !viewer.camera) {
      return;
    }
    const customDataSource = new CustomDataSource('Disasters');
    viewer.dataSources.add(customDataSource);
  }, [dataFilter, data]);

  useEffect(() => {
    if (!custom || !viewerRef.current) return;
    applyFilters();
  }, [dataFilter, data])  

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.scene || !viewer.camera) {
      return;
    }

    const tooltip = document.createElement('div') as HTMLDivElement;
    tooltip.style.display = 'none';
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'white';
    tooltip.style.border = '1px solid white';
    tooltip.style.borderRadius = '10px';
    tooltip.style.padding = '5px';
    tooltip.style.color = 'black';
    document.body.appendChild(tooltip);

    const tooltipContent = document.createElement('div') as HTMLDivElement;
    tooltipContent.style.display = 'none';
    tooltipContent.style.position = 'absolute';
    tooltipContent.style.backgroundColor = 'white';
    tooltipContent.style.border = '1px solid white';
    tooltipContent.style.borderRadius = '10px';
    tooltipContent.style.padding = '5px';
    tooltipContent.style.color = 'black';
    document.body.appendChild(tooltipContent);

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement: any) => {
      const pickedObject = viewerRef.current?.scene.pick(movement.endPosition);
      if (defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
        const properties = pickedObject.id.properties;

        if (properties._type && properties._type._value === "alert"){
          const alartrData: alartInfoHover = {
            alertCountryName: properties._alertCountryName?._value,
            alertRadius: properties._alertRadius?._value,
            alertlevelRed: properties._alertlLevelRed?._value,
            alertlevelOrange: properties._alertLevelOrange?._value,
            alertlevelGreen: properties._alertLevelGreen?._value,
            createAt: properties._createdAt?._value,
          };
          console.log(properties)
          tooltipContent.innerHTML = `
          <div>
            <table>
              <tbody>
                <tr>
                  <td style="color: #666;">Country :</td>
                  <td style="color: #000;">${alartrData.alertCountryName}</td>
                </tr>
                <tr>
                  <td style="color: #666;">Radius :</td>
                  <td style="color: #000;">${alartrData.alertRadius}</td>
                </tr>
                <tr>
                  <td style="color: #666;">AlertLevel :</td>
                  <td style="color: #000;">
                  <div style="display: flex; align-items: center; justify-content: center;">
                    <span style="margin: 10px; height: 10px; width: 10px; background-color: ${alartrData.alertlevelRed ? "red" : "gray"}; border-radius: 50%;"></span>
                    <span style="margin: 10px; height: 10px; width: 10px; background-color: ${alartrData.alertlevelOrange ? "orange" : "gray"}; border-radius: 50%;"></span>
                    <span style="margin: 10px; height: 10px; width: 10px; background-color: ${alartrData.alertlevelGreen ? "green" : "gray"}; border-radius: 50%;"></span>
                  </div>
                  </td>
                </tr>
                <tr>
                  <td style="color: #666;">CreateAt:</td>
                  <td style="color: #000;">${alartrData.createAt.slice(0,10)}</td>
                </tr>
              </tbody>
            </table>
          </div>`;
        tooltipContent.style.display = 'block';
        tooltipContent.style.bottom = `${window.innerHeight - movement.endPosition.y -50}px`;
        tooltipContent.style.left = `${movement.endPosition.x + window.innerWidth/3}px`;
        // 툴팁 위치 조정
        adjustTooltipPosition(movement.endPosition);
      } else {
        tooltipContent.style.display = 'none';
      }
      if(properties._type && properties._type._value === "disaster") {

        const disasterData: disasterInfoHover = {
          dId: properties._dID?._value,
          dType: properties._dType?._value,
          dCountry: properties._dCountry?._value,
          dStatus: properties._dStatus?._value,
          dDate: properties._dDate?._value,
        };

        tooltip.innerHTML = `
          <div>
            <img src="./Disaster/${disasterData.dType}.png" alt="${disasterData.dType}" style="width: 36px; height: 36px; margin-bottom: 10px;">
            <table>
              <tbody>
                <tr>
                  <td style="color: #666;">Type:</td>
                  <td style="color: #000;">${disasterData.dType}</td>
                </tr>
                <tr>
                  <td style="color: #666;">Country:</td>
                  <td style="color: #000;">${disasterData.dCountry}</td>
                </tr>
                <tr>
                  <td style="color: #666;">Date:</td>
                  <td style="color: #000;">${disasterData.dDate}</td>
                </tr>
                <tr>
                  <td style="color: #666;">Status:</td>
                  <td style="color: #000;">${disasterData.dStatus}</td>
                </tr>
              </tbody>
            </table>
          </div>`;
      

        tooltip.style.display = 'block';
        tooltip.style.bottom = `${window.innerHeight - movement.endPosition.y -50}px`;
        tooltip.style.left = `${movement.endPosition.x + window.innerWidth/3}px`;
        adjustTooltipPosition(movement.endPosition);
      } else {
        tooltip.style.display = 'none';
      }
    } else {
      tooltip.style.display = 'none';
      tooltipContent.style.display = 'none';
    }
  }, ScreenSpaceEventType.MOUSE_MOVE);

    const adjustTooltipPosition = (position:any) => {
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let left = position.x;
      let top = window.innerHeight - position.y;

      if (left + tooltipWidth > windowWidth) {
        left = windowWidth - tooltipWidth;
      }

      if (top + tooltipHeight > windowHeight) {
        top = windowHeight - tooltipHeight;
      }
    }

    return () => {
      handler.destroy();
    };
  }, [viewerRef.current]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.scene || !viewer.camera) {
      return;
    }
    
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    let lastAddedEntity: Entity | null = null;

    handler.setInputAction((movement:any) => {
      const cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
      if (cartesian) {
        const cartographic = Ellipsoid.WGS84.cartesianToCartographic(cartesian);
        const lon = Math.toDegrees(cartographic.longitude).toFixed(4);
        const lat = Math.toDegrees(cartographic.latitude).toFixed(4);

        setMailAlarmInfo( {...mailAlarmInfo, alertLongitude:Number(lon), alertLatitude:Number(lat), open:true});
        setShowAlertTab(true);

        if (lastAddedEntity){
          viewer.entities.remove(lastAddedEntity);
        }

          lastAddedEntity = viewer.entities.add({
          position: Cartesian3.fromDegrees(Number(lon), Number(lat)),
          point: {
            pixelSize: 10,
            color: Color.RED,
            outlineColor: Color.WHITE,
            outlineWidth: 2
          },
          ellipse: {
            semiMinorAxis : mailAlarmInfo.alertRadius*1000,
            semiMajorAxis : mailAlarmInfo.alertRadius*1000,
            height: 0,
            material: Color.RED.withAlpha(0.2),
            outline : true,
            outlineColor : new Color(255, 0, 0, 127),
          },
          id: String(mailAlarmInfo.objectId)
        });
      }  
    }, ScreenSpaceEventType.RIGHT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [viewerRef.current]);

  useEffect(()=>{
    const viewer = viewerRef.current;
    if (!viewer || !viewer.scene || !viewer.camera) {
      return;
    }

    const entityId = mailAlarmInfo.objectId;
    const entity = viewer.entities.getById(String(entityId));

    if (entity && entity.ellipse){
      entity.ellipse.semiMinorAxis = new ConstantProperty(mailAlarmInfo.alertRadius*1000);
      entity.ellipse.semiMajorAxis = new ConstantProperty(mailAlarmInfo.alertRadius*1000);
    }

    if (entity && mailAlarmInfo.open==false){
      viewer.entities.remove(entity);
    }

  },[mailAlarmInfo])


  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.scene || !viewer.camera) {
      return;
    }

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((click: any) => {
      const pickedObject = viewer.scene.pick(click.position);
      if (defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
        const properties = pickedObject.id.properties;
        if (properties._type && properties._type._value === "disaster") {
          const dID = properties._dID?._value;
          setSelectedDisasterId(dID); 
          const disasterData = {
            dId: properties._dID?._value,
            dType: properties._dType?._value,
            dCountry: properties._dCountry?._value,
            dStatus: properties._dStatus?._value,
            dDate: properties._dDate?._value,
            dCountryLatitude: properties._dCountryLatitude?._value,
            dCountryLongitude: properties._dCountryLongitude?._value,
            dLatitude: properties._dLatitude?._value,
            dLongitude: properties._dLongitude?._value,
            objectId: properties._objectId?._value,
          };
          const camaraHeight = Ellipsoid.WGS84.cartesianToCartographic(viewer.camera.position).height;
          router.push(`/earth?lon=${disasterData.dLongitude}&lat=${disasterData.dLatitude}&height=${camaraHeight}&did=${disasterData.dId}`, undefined);
          setDIdValue(disasterData.dId);
          setIsUserInput(true)
          setClickedEntity(pickedObject.id);
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };

  }, [viewerRef.current]);

  useEffect(() => {
    if (clickedEntity) {
      if (activeAnimation) {
        activeAnimation.stop();
        if (activeAnimation.entity.point) {
          activeAnimation.entity.point.pixelSize = new ConstantProperty(activeAnimation.originalSize);
        }
      }
      applyBlinkingEffect(clickedEntity);
    }
  }, [clickedEntity]);

  const applyBlinkingEffect = (entity: Entity) => {
    if (!entity.point?.pixelSize) return;

    let growing = true;
    const originalSize = entity.point.pixelSize.getValue(JulianDate.now());
    const maxSize = originalSize * 5;
    let currentSize = originalSize;

    const onTickListener = () => {
      if (!entity.point) return;

      if (growing) {
        currentSize += 1.5;
        if (currentSize >= maxSize) growing = false;
        currentSize -= 1.5;
        if (currentSize <= originalSize) growing = true;
      }

      entity.point.pixelSize = new ConstantProperty(currentSize);
    };

    if (activeAnimation) {
      activeAnimation.stop();
    }

    viewerRef.current?.clock.onTick.addEventListener(onTickListener);

    setActiveAnimation({
      stop: () => viewerRef.current?.clock.onTick.removeEventListener(onTickListener),
      entity: entity,
      originalSize: originalSize
    });
  };

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !viewer.scene || !viewer.camera) {
      return;
    };

    const moveEndListener = viewer.camera.moveEnd.addEventListener(() => {
      const cameraPosition = viewer.camera.positionCartographic;
      const longitude = Math.toDegrees(cameraPosition.longitude).toFixed(4);
      const latitude = Math.toDegrees(cameraPosition.latitude).toFixed(4);
      const cameraHeight = Ellipsoid.WGS84.cartesianToCartographic(viewer.camera.position).height;
      router.push(`/earth?lon=${longitude}&lat=${latitude}&height=${cameraHeight}`, undefined);
    });

    return () => {
      if (!isUserInput) {
        moveEndListener()
      }
    }

  }, [viewerRef.current?.camera, search.get('did')]);

  useEffect(() => {
    const viewer = viewerRef.current;
    const lon = search.get('lon');
    const lat = search.get('lat');
    const zoomHeight = search.get('height');
    const detail = search.get('did');
    if (!viewer || !viewer.scene || !viewer.camera || !isUserInput) {
      return;
    };
    if (lon && lat && viewer && viewer.scene && viewer.camera) {
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(lon ? Number(lon) : 0, lat ? Number(lat) : 0, zoomHeight ? Number(zoomHeight) : 10e5),
        duration: 1,
        complete: () => {
          if (detail) {
            setDIdValue(detail);
          }
        }
      });
    }
  }, [search.get('lon'), search.get('lat'), search.get('height'), search.get('did')]);

  return (
    <>
      <div className='h-[100vh] pt-[60px]' ref={cesiumContainer}>
        <AlertModule />
        <ChatToggleComponent />
      </div>
    </>
  );
};

export default EarthCesium;