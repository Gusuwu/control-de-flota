<?php

class MovilOdometro
{
    public $table = 'MovilOdometro';
    public $fields = 'modoId
                ,modoMoviId
                ,CONVERT(VARCHAR, modoFecha, 126) modoFecha
                ,modoOdometro
                ,CONVERT(VARCHAR, modoFechaAlta, 126) modoFechaAlta
                ,modoBorrado'; 

    public $join = "LEFT OUTER JOIN Movil ON modoMoviId = moviId";
    
    public function get ($db) {
        $sql = "SELECT $this->fields FROM $this->table
                $this->join
                WHERE modoBorrado = 0";

        $params = null;
        if (isset( $_GET["modoMoviId"])){
             $params = [$_GET["modoMoviId"]];
            $sql = $sql . " AND modoMoviId = ? ";
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
        "UPDATE $this->table SET modoBorrado = 1 - modoBorrado
        WHERE modoId = ?", [$id] );
        

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $stmt = SQL::query($db,
        "INSERT INTO $this->table
        (modoMoviId
        ,modoFecha
        ,modoOdometro
        ,modoFechaAlta
        ,modoBorrado)
        VALUES (?,?,?,GETDATE(),0);

        SELECT @@IDENTITY modoId, CONVERT(VARCHAR, GETDATE(), 126) modoFechaAlta;",
        [DATA["modoMoviId"], DATA["modoFecha"],DATA["modoOdometro"]] );

        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["modoId"] = $row["modoId"];
        $results["modoFechaAlta"] = $row["modoFechaAlta"];
        $results["modoBorrado"] = 0;
        return $results;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET modoMoviId = ?
            ,CONVERT(VARCHAR, modoFecha, 126) modoFecha = ?
            ,modoOdometro = ?
        WHERE modoId = ?",
        [
            DATA["modoFecha"],
            DATA["modoOdometro"],
            DATA["modoId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>