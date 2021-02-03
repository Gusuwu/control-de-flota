<?php

class Tarea
{
    public $table = 'Tarea';
    public $fields = 'tareId
                ,tareNombre
                ,tareDescripcion
                ,tareUnidadMedida
                ,tareCantidad
                ,tareCosto
                ,CONVERT(VARCHAR, tareFechaAlta, 126) tareFechaAlta
                ,tareBorrado'; 

    public $join = "";
    
    public function get ($db) {
        $sql = "SELECT $this->fields FROM $this->table
                $this->join
                WHERE tareBorrado = 0";

        $stmt = SQL::query($db, $sql, null);
        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    public function delete ($db, $id) {
        $stmt = SQL::query($db,
        "UPDATE $this->table SET tareBorrado = 1 - tareBorrado
        WHERE tareId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $stmt = SQL::query($db,
        "INSERT INTO $this->table
        (tareNombre
        ,tareDescripcion
        ,tareUnidadMedida
        ,tareCantidad
        ,tareCosto
        ,tareFechaAlta
        ,tareBorrado)
        VALUES (?,?,?,?,?,GETDATE(),0);

        SELECT @@IDENTITY tareId, CONVERT(VARCHAR, GETDATE(), 126) tareFechaAlta;",
        [DATA["tareNombre"], DATA["tareDescripcion"],DATA["tareUnidadMedida"],DATA["tareCantidad"],DATA["tareCosto"]] );

        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["tareId"] = $row["tareId"];
        $results["tareFechaAlta"] = $row["tareFechaAlta"];
        $results["tareBorrado"] = 0;
        return $results;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET tareNombre = ?
            ,tareDescripcion = ?
            ,tareUnidadMedida = ?
            ,tareCantidad = ?
            ,tareCosto = ?
        WHERE tareId = ?",
        [
            DATA["tareNombre"],
            DATA["tareDescripcion"],
            DATA["tareUnidadMedida"],
            DATA["tareCantidad"],
            DATA["tareCosto"],
            DATA["tareId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>