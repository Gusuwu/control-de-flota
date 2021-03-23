<?php

class BitacoraTarea
{
    public $table = 'BitacoraTarea';
    public $fields = 'bitaId
            ,bitaMobiId
            ,bitaTareId
            ,CONVERT(VARCHAR, bitaFechaAlta, 126) bitaFechaAlta
            ,bitaBorrado
            ,bitaObservaciones
            ,bitaCantidad
            ,bitaCosto'; 

    public $join = " LEFT OUTER JOIN Tarea ON bitaTareId = tareId";
    
    public function get ($db) {
        $sql = "SELECT TOP (1000) $this->fields FROM $this->table
                $this->join
                WHERE bitaBorrado = 0";

        $params = null;
        if (isset( $_GET["bitaMobiId"])){
            $params = [$_GET["bitaMobiId"]];
            $sql = $sql . " AND bitaMobiId = ? ";
        };
        

        $stmt = SQL::query($db, $sql, $params);
        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    public function delete ($db, $id) {
        $stmt = SQL::query($db,
        "UPDATE $this->table SET bitaBorrado = 1 - bitaBorrado
        WHERE bitaId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $stmt = SQL::query($db,
        "INSERT INTO $this->table
            (bitaMobiId
            ,bitaTareId
            ,bitaObservaciones
            ,bitaCantidad
            ,bitaCosto
            ,bitaFechaAlta
            ,bitaBorrado)
        VALUES (?,?,GETDATE(),0);

        SELECT @@IDENTITY bitaId, CONVERT(VARCHAR, GETDATE(), 126) bitaFechaAlta;",
        [ DATA["bitaMobiId"]
        ,DATA["bitaTareId"]
        ,DATA["bitaObservaciones"]
        ,DATA["bitaCantidad"]
        ,DATA["bitaCosto"]] );

        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["bitaId"] = $row["bitaId"];
        $results["bitaFechaAlta"] = $row["bitaFechaAlta"];
        $results["bitaBorrado"] = 0;
        return $results;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET bitaTareId = ?
        WHERE bitaId = ?",
        [
            DATA["bitaTareId"],
            DATA["bitaId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>