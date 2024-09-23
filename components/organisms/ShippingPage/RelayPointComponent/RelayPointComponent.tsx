import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { Control, FieldErrorsImpl, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button/Button";
import Input from "@/components/atoms/Input/Input";
import Select from "@/components/atoms/Select/SelectRHF";
import ShippingMethodButton from "@/components/molecules/ShippingMethodButton/ShippingMethodButton";
import {
  OrderJsonldShopCartReadCustomer,
  RelayPointDTOJsonld,
  RelayPointDTOJsonldListeHoraireOuvertureItem,
  ShippingMethodJsonldShopOrderReadCode,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useShopGetCountryCollection } from "@/networking/sylius-api-client/country/country";
import { usePostRelayPointDTOCollection } from "@/networking/sylius-api-client/relay-point-dt-o/relay-point-dt-o";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";

import { FormType } from "../constants";
import styles from "./RelayPointComponent.module.scss";

type RelayPointComponentProps = {
  setFormData: (newShippingMethod: string, relayPointData?: RelayPointDTOJsonld) => void;
  currentShippingMethod: string;
  register: UseFormRegister<FormType>;
  control: Control<FormType>;
  errors: FieldErrorsImpl<FormType>;
  handleSubmit: UseFormHandleSubmit<FormType>;
  relayPoints: RelayPointDTOJsonld[] | null;
  setRelayPoints: (relayPoints: RelayPointDTOJsonld[]) => void;
  customer: OrderJsonldShopCartReadCustomer | undefined;
  setShouldBeDisabled: Dispatch<SetStateAction<boolean>>;
  currentCountryCode: string;
};

const RelayPointComponent = ({
  setFormData,
  currentShippingMethod,
  register,
  control,
  errors,
  handleSubmit,
  relayPoints,
  setRelayPoints,
  customer,
  setShouldBeDisabled,
  currentCountryCode,
}: RelayPointComponentProps) => {
  const { t } = useTranslation();

  const getDayOfTheWeek = (nbDayInWeek: number | undefined): string => {
    switch (nbDayInWeek) {
      case 1:
        return t("livraison:RELAY_POINT.jourSemaine1");
      case 2:
        return t("livraison:RELAY_POINT.jourSemaine2");
      case 3:
        return t("livraison:RELAY_POINT.jourSemaine3");
      case 4:
        return t("livraison:RELAY_POINT.jourSemaine4");
      case 5:
        return t("livraison:RELAY_POINT.jourSemaine5");
      case 6:
        return t("livraison:RELAY_POINT.jourSemaine6");
      case 7:
        return t("livraison:RELAY_POINT.jourSemaine7");
      case undefined:
        return "";
      default:
        return "";
    }
  };
  const { data: enabledCountries } = useShopGetCountryCollection(
    { enabled: true },
    { query: { staleTime: STALE_TIME_HOUR } },
  );
  const { mutateAsync, isLoading } = usePostRelayPointDTOCollection();
  const [selectedRelayPoint, setSelectedRelayPoint] = useState<string>("");

  const onSubmit = async (formData: FormType) => {
    try {
      const fetchedRelayPoints = await mutateAsync({
        data: formData.relayPoint,
      });
      // @ts-expect-error Orval sending the wrong type
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setRelayPoints(fetchedRelayPoints["hydra:member"]);
    } catch (error) {
      toast.error<string>(t("common:common.errorOccurred"));
    }
  };

  return (
    <div className={styles.mainContainer}>
      {currentCountryCode === "FR" && (
        <Image
          className={styles.absolute}
          src="/logoPointRelais.jpg"
          alt="Point Relais"
          width={100}
          height={45}
        />
      )}

      <div className={styles.title}>{t("livraison:RELAY_POINT.yourAddress")}</div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
        <Input
          label={t("common:common.addressLabel")}
          type="text"
          error={errors.relayPoint?.address?.message}
          placeholder={t("common:common.addressLabel")}
          defaultValue={customer?.defaultAddress?.street ?? ""}
          {...register("relayPoint.address")}
        />
        <div className={styles.manyInputs}>
          <Input
            className={styles.expandDropdown}
            label={t("common:common.postalCode")}
            type="text"
            showRequiredStar
            error={errors.relayPoint?.zipCode?.message}
            placeholder={t("common:common.postalCode")}
            defaultValue={customer?.defaultAddress?.postcode ?? ""}
            {...register("relayPoint.zipCode", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
          <Input
            className={styles.expandDropdown}
            label={t("common:common.city")}
            type="text"
            showRequiredStar
            error={errors.relayPoint?.city?.message}
            placeholder={t("common:common.city")}
            defaultValue={customer?.defaultAddress?.city ?? ""}
            {...register("relayPoint.city", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
          <Select
            control={control}
            className={styles.expandDropdown}
            label={t("common:common.country")}
            disabled
            error={errors.relayPoint?.countryCode?.message}
            {...register("relayPoint.countryCode")}
            options={{
              groups: [
                {
                  key: t("common:common.country"),
                  title: t("common:common.country"),
                  options: (enabledCountries ?? [])
                    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
                    .map(country => ({ value: country.code, label: country.name ?? "" })),
                },
              ],
            }}
          />
        </div>
        <Button variant="primaryBlack" isLoading={isLoading} className={styles.validateButton}>
          {t("livraison:RELAY_POINT.validate")}
        </Button>
      </form>
      {relayPoints && (
        <div className={styles.title}>{t("livraison:RELAY_POINT.choseRelayPoint")}</div>
      )}
      {relayPoints?.map((relayPoint: RelayPointDTOJsonld) => {
        return (
          <ShippingMethodButton
            key={relayPoint.id}
            code={ShippingMethodJsonldShopOrderReadCode["1-FRANCE-RELAYPOINT"]}
            changeShippingMethod={() => {
              setSelectedRelayPoint(relayPoint.id ?? "");
              setShouldBeDisabled(false);
              setFormData(currentShippingMethod, {
                id: relayPoint.id ?? "",
                address1: relayPoint.address1 ?? "",
                postcode: relayPoint.postcode ?? "",
                localite: relayPoint.localite ?? "",
                countryCode: relayPoint.countryCode ?? "",
                name: relayPoint.name ?? "",
              });
            }}
            isSelected={relayPoint.id === selectedRelayPoint}
            showAutomaticContent={false}
          >
            <div className={styles.relayPointContainer}>
              <div className={styles.relayPointMainContainer}>
                <div className={styles.relayPointName}>{relayPoint.name}</div>
                <div className={styles.dontShowOnMobile}>|</div>
                <div className={styles.relayPointAddress}>
                  {relayPoint.address1?.toLocaleLowerCase()}
                </div>
                {relayPoint.address2 !== "" && (
                  <div className={styles.relayPointAddress}>
                    {relayPoint.address2?.toLocaleLowerCase()}
                  </div>
                )}
                {relayPoint.address3 !== "" && (
                  <div className={styles.relayPointAddress}>
                    {relayPoint.address3?.toLocaleLowerCase()}
                  </div>
                )}
              </div>
              <div className={styles.relayPointDistance}>
                {t("livraison:RELAY_POINT.distance", {
                  distance: relayPoint.distance ?? 0,
                })}
              </div>
            </div>
            {selectedRelayPoint === relayPoint.id &&
              relayPoint.listeHoraireOuverture !== undefined && (
                <div className={styles.relayPointHoraires}>
                  {relayPoint.listeHoraireOuverture
                    .sort(
                      (
                        day1: RelayPointDTOJsonldListeHoraireOuvertureItem,
                        day2: RelayPointDTOJsonldListeHoraireOuvertureItem,
                      ) => {
                        if (day1.nbDayInWeek === undefined || day2.nbDayInWeek === undefined) {
                          return -1;
                        }

                        return day1.nbDayInWeek - day2.nbDayInWeek;
                      },
                    )
                    .map((day: RelayPointDTOJsonldListeHoraireOuvertureItem) => {
                      const firstPartOfSchedule = day.openingSchedule?.split(" ")[0];
                      const secondPartOfScheduleIfExists = day.openingSchedule?.split(" ")[1];

                      return (
                        <tr key={day.nbDayInWeek}>
                          <td>{getDayOfTheWeek(day.nbDayInWeek)}</td>
                          <td>{firstPartOfSchedule}</td>
                          {secondPartOfScheduleIfExists != null ? (
                            <td> | {secondPartOfScheduleIfExists}</td>
                          ) : (
                            <td></td>
                          )}
                        </tr>
                      );
                    })}
                </div>
              )}
          </ShippingMethodButton>
        );
      })}
      {relayPoints && relayPoints.length === 0 && (
        <div className={styles.noRelayPoint}>{t("livraison:RELAY_POINT.noRelayPoint")}</div>
      )}
    </div>
  );
};

export default RelayPointComponent;
