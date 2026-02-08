import React, { useContext } from "react";
import moment from "moment";

import { ThemeContext } from "@niveshstar/context";

import Button from "../../Button";
import CustomCard from "../../CustomCard";
import FlexRow from "../../FlexRow";
import Padding from "../../Padding";
import Typography from "../../Typography";

interface PropsType {
  data: any;
  hanldeSelectNotesId: (id: string) => void;
}

function NotesRow(props: PropsType) {
  const { data, hanldeSelectNotesId } = props;
  const { themeColor } = useContext(ThemeContext);

  return (
    <CustomCard style={{ backgroundColor: themeColor.gray[3] }}>
      <Typography>{data.notes}</Typography>
      <Padding height={8} />
      <FlexRow alignItems="center" justifyContent="space-between">
        <Typography size="1" color={themeColor.gray[10]}>
          {moment(data.created_at).format("D MMMM YYYY")}
        </Typography>
        <Button
          title="Remove"
          variant="soft"
          color="danger"
          onPress={() => hanldeSelectNotesId(data.id)}
          typographyProps={{
            size: "1",
          }}
        />
      </FlexRow>
    </CustomCard>
  );
}

export default React.memo(NotesRow);
